"""Composiciones del caso Gloop: pantallas nativas (capturas y grabaciones del simulador)
flotando sobre un campo de color de Gloop, sin marco ni cursor. Una pieza por hueco, ya
con la proporción del hueco (la web recorta con object-cover)."""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

S = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
SHOTS, NORM, TMP = f"{S}/shots", f"{S}/norm", f"{S}/tmp"
os.makedirs(NORM, exist_ok=True); os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
SR = 1206 / 2622  # proporción de la pantalla del iPhone 18 Pro

BASE = (11, 6, 19)
ACCENT = {
    "violet": [((128, 60, 236), (0.25, 0.1), 0.95), ((234, 92, 128), (0.95, 0.95), 0.55)],
    "magenta": [((234, 92, 128), (0.2, 0.15), 0.9), ((128, 60, 236), (0.9, 0.85), 0.7)],
    "teal": [((31, 163, 163), (0.3, 0.2), 0.85), ((128, 60, 236), (0.85, 0.9), 0.6)],
    "lime": [((170, 210, 60), (0.25, 0.15), 0.7), ((31, 140, 150), (0.9, 0.9), 0.55)],
    "night": [((234, 92, 128), (0.0, 0.0), 0.55), ((128, 60, 236), (0.75, 0.0), 0.62), ((104, 56, 230), (1.05, 0.5), 0.5)],
}


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def field(w, h, accent):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    img = np.zeros((h, w, 3), np.float32) + BASE
    for col, (cx, cy), a in ACCENT[accent]:
        d = np.sqrt(((x / w - cx) / 0.75) ** 2 + ((y / h - cy) / 0.75) ** 2)
        k = np.clip(1 - d, 0, 1) ** 1.6 * a
        img = img * (1 - k[..., None]) + np.array(col, np.float32) * k[..., None]
    noise = np.random.default_rng(7).normal(0, 2.2, (h, w, 1))  # grano fino, evita bandas
    return Image.fromarray(np.clip(img + noise, 0, 255).astype(np.uint8))


def mask(w, h):
    m = Image.new("L", (w * 2, h * 2), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=int(w * 2 * 0.137), fill=255)
    return m.resize((w, h), Image.LANCZOS)


def layout(W, H, n, sh):
    sw = round(sh * SR) // 2 * 2
    sh = sh // 2 * 2
    gap = round(sw * 0.12)
    x0 = (W - (n * sw + (n - 1) * gap)) // 2
    return [(x0 + i * (sw + gap), (H - sh) // 2) for i in range(n)], sw, sh


def compose(name, W, H, accent, slots, sh, t=None):
    """slots: lista de 'shots/x.png' (fija) o 'norm/x.mp4' (vídeo)."""
    pos, sw, sh = layout(W, H, len(slots), sh)
    bg = field(W, H, accent).convert("RGBA")
    m = mask(sw, sh)
    shadow = Image.new("L", (W, H), 0)
    for x, y in pos:
        shadow.paste(m, (x, y + int(sh * 0.03)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(sh * 0.035)).point(lambda v: int(v * 0.6))
    bg = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), bg, shadow)
    vids = []
    for (x, y), s in zip(pos, slots):
        if s.endswith(".png"):
            im = Image.open(f"{S}/{s}").convert("RGB").resize((sw, sh), Image.LANCZOS)
            bg.paste(im, (x, y), m)
        else:
            vids.append((x, y, s))
    if not vids:
        bg.convert("RGB").save(f"{OUT}/{name}.jpg", quality=86, optimize=True)
        return print("img", name)
    bgp, mp = f"{TMP}/{name}-bg.png", f"{TMP}/{name}-m.png"
    bg.convert("RGB").save(bgp); m.save(mp)
    cmd = [FF, "-y", "-loop", "1", "-i", bgp, "-loop", "1", "-i", mp]
    for _, _, s in vids:
        cmd += ["-stream_loop", "-1", "-i", f"{S}/{s}"]
    def secs(f):
        h, mi, se = subprocess.run([FF, "-i", f], capture_output=True, text=True).stderr.split("Duration: ")[1][:11].split(":")
        return int(h) * 3600 + int(mi) * 60 + float(se)
    dur = t or min(secs(f"{S}/{s}") for _, _, s in vids)
    f, last = [f"[1]split={len(vids)}" + "".join(f"[m{i}]" for i in range(len(vids)))], "0"
    for i, (x, y, _) in enumerate(vids):
        f.append(f"[{i+2}]scale={sw}:{sh},format=rgba[v{i}];[v{i}][m{i}]alphamerge[a{i}]")
        f.append(f"[{last}][a{i}]overlay={x}:{y}:shortest=0[o{i}]"); last = f"o{i}"
    cmd += ["-filter_complex", ";".join(f), "-map", f"[{last}]", "-t", f"{dur:.2f}", "-r", "30",
            "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
            f"{OUT}/{name}.mp4"]
    run(cmd)
    print("vid", name, f"{dur:.1f}s")


def norm(src, dst, ss, to=None, pad=0):
    """Recorta el arranque, fija 30 fps y alarga el último plano `pad` segundos."""
    cmd = [FF, "-y", "-ss", str(ss)] + (["-to", str(to)] if to else []) + ["-i", f"{S}/clips/{src}.mp4",
           "-vf", f"fps=30,scale=804:-2" + (f",tpad=stop_mode=clone:stop_duration={pad}" if pad else ""),
           "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p", "-an", f"{NORM}/{dst}.mp4"]
    run(cmd)


if __name__ == "__main__":
    step = sys.argv[2] if len(sys.argv) > 2 else "all"
    if step in ("norm", "all"):
        for src, ss, to, pad in [("overview-raw", 4.9, None, 2.5), ("unirse", 2.95, None, 1.5), ("diario", 3.6, None, 1),
                                 ("ruleta", 3.0, None, 1), ("visor", 3.2, None, 0), ("cuenta", 3.1, None, 1),
                                 ("momento", 3.4, None, 2)]:
            norm(src, src.replace("-raw", ""), ss, to, pad); print("norm", src)
    if step in ("compose", "all"):
        compose("decision-unirse", 1200, 1500, "violet", ["norm/unirse.mp4"], 1230)
        compose("decision-diario", 1200, 1500, "magenta", ["norm/diario.mp4"], 1230)
        compose("decision-ruleta", 1200, 1500, "teal", ["norm/ruleta.mp4"], 1230)
        compose("exp-equipos", 1600, 1200, "violet", ["shots/01-equipos-night.png", "shots/03-equipo-piso.png", "shots/08-chat.png"], 1000)
        compose("exp-noche", 1200, 1600, "magenta", ["norm/momento.mp4"], 1300)
        compose("exp-momentos", 1200, 1600, "night", ["norm/visor.mp4"], 1300)
        compose("exp-cuenta", 1600, 1200, "lime", ["norm/cuenta.mp4", "shots/07-deuda.png"], 1000)
        compose("prototipo", 1920, 1080, "night", ["shots/02-equipos-new.png", "shots/14-experiencia.png", "shots/15-ruta.png", "shots/16-exp-result.png", "shots/18-perfil.png"], 880)
        compose("flujo-dia", 2100, 900, "violet", ["shots/09-momentos.png", "norm/overview.mp4", "shots/20-tab-piso.png"], 760)
        compose("nativa", 1920, 1080, "night", ["norm/overview.mp4"], 960)
        compose("hero", 1920, 1080, "night", ["norm/diario.mp4", "norm/ruleta.mp4", "norm/visor.mp4"], 900, t=12)
