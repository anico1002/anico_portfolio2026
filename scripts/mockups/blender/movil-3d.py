"""Móvil que gira en un estudio a oscuras, con el vídeo de la app en la pantalla (2026-10-18, cabecera y miniatura
de Dovla; referencia: art-yakushev.com). Todo procedural: el iPhone es un bloque de esquinas
redondeadas con canto de titanio, cristal y pantalla; con giros de ±35° solo se ven la cara y el canto.

  Blender -b -P scripts/mockups/blender/movil-3d.py -- --video <app.mp4> --out <carpeta/> [--stills] [--w 1280 --h 800]
  [--samples 96] [--frames 180] [--video-start 0]

--stills: cuatro fotogramas sueltos para juzgar la luz. Sin él, el bucle entero (PNG numerados; se montan con ffmpeg).
El giro es una senoide de un periodo, así que el último fotograma enlaza con el primero.
La escena: un sin fin berenjena casi negro, una luz muy focal sobre el móvil y luces berenjena que giran con él, como
un objeto en un estudio de fotografía. La primera prueba llevaba un pedestal; Alberto lo descartó del todo
(2026-10-18) y ya no existe.
--tail T: renderiza T fotogramas más allá del bucle (misma pose que los primeros) para fundir el vídeo de la pantalla
en la costura (scripts/mockups/blender/loop.py).
"""
import bpy, bmesh, math, sys, argparse
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True); ap.add_argument("--out", required=True)
ap.add_argument("--stills", action="store_true"); ap.add_argument("--w", type=int, default=1280); ap.add_argument("--h", type=int, default=800)
ap.add_argument("--samples", type=int, default=96); ap.add_argument("--frames", type=int, default=180)
ap.add_argument("--video-start", type=int, default=0)
ap.add_argument("--tail", type=int, default=0)
A = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ── Materiales ──────────────────────────────────────────────────────────────
def mat(name, color, metal=0.0, rough=0.5, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    b.inputs["Coat Weight"].default_value = coat
    return m

titanium = mat("titanio", (0.16, 0.15, 0.145), metal=1.0, rough=0.18)
glass = mat("cristal", (0.004, 0.004, 0.004), rough=0.04, coat=1.0)
# Sin fin berenjena: solo se ve donde le llega la luz; lo demás cae a negro.
wall_m = mat("fondo", (0.05, 0.017, 0.038), rough=0.85)

# Pantalla: el vídeo como emisión, con la capa de cristal encima para que los reflejos la barran al girar.
screen_m = bpy.data.materials.new("pantalla"); screen_m.use_nodes = True
nt = screen_m.node_tree; b = nt.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0, 0, 0, 1)
b.inputs["Roughness"].default_value = 0.03
b.inputs["Coat Weight"].default_value = 1.0
tex = nt.nodes.new("ShaderNodeTexImage")
img = bpy.data.images.load(A.video); img.source = "MOVIE"
tex.image = img
iu = tex.image_user; iu.frame_duration = img.frame_duration; iu.frame_start = 1 - A.video_start
iu.use_auto_refresh = True; iu.use_cyclic = True
nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
b.inputs["Emission Strength"].default_value = 1.5

# ── El móvil (1 unidad = 1 cm; iPhone Pro: 7,19 × 15,0 × 0,875) ─────────────
W, H, D, R = 7.19, 15.0, 0.875, 1.15

def rounded_rect(w, h, r, seg=16):
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

def slab(name, w, h, r, depth, z0, material, bevel=0.0):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    vs = [bm.verts.new((x, y, z0)) for x, y in rounded_rect(w, h, r)]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, verts=[v for v in ext["geom"] if isinstance(v, bmesh.types.BMVert)], vec=(0, 0, depth))
    bm.normal_update(); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    ob.data.materials.append(material)
    if bevel:
        mod = ob.modifiers.new("canto", "BEVEL"); mod.width = bevel; mod.segments = 8; mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(60)
    for p in ob.data.polygons: p.use_smooth = True
    ob.modifiers.new("normales", "WEIGHTED_NORMAL")
    return ob

# El giro va en un pivote; el móvil, hijo suyo, se pone de pie (X), mirando a cámara, y se ladea en su plano (Z).
pivot = bpy.data.objects.new("pivote", None); bpy.context.collection.objects.link(pivot)
phone = bpy.data.objects.new("movil", None); bpy.context.collection.objects.link(phone)
phone.parent = pivot
phone.rotation_mode = "ZXY"
phone.rotation_euler = (math.radians(78), 0, math.radians(-16))
parts = [
    slab("cuerpo", W, H, R, D, -D / 2, titanium, bevel=0.28),
    slab("frente", W - 0.08, H - 0.08, R - 0.04, 0.02, D / 2 - 0.005, glass),
]
# La pantalla: el vídeo encajado en un rectángulo redondeado, con UV de 0 a 1.
SW, SH, SR = W - 0.42, H - 0.42, R - 0.2
scr = slab("pantalla", SW, SH, SR, 0.002, D / 2 + 0.016, screen_m)
me = scr.data
uv = me.uv_layers.new()
for poly in me.polygons:
    for li in poly.loop_indices:
        co = me.vertices[me.loops[li].vertex_index].co
        uv.data[li].uv = ((co.x + SW / 2) / SW, (co.y + SH / 2) / SH)
parts.append(scr)
# Botones del canto (acción, volumen, encendido, control de cámara).
for name, x, y, h in (("accion", -1, 4.0, 0.75), ("vol+", -1, 2.55, 1.35), ("vol-", -1, 0.95, 1.35), ("power", 1, 2.4, 2.0), ("camara", 1, -2.6, 1.25)):
    bt = slab(name, 0.12, h, 0.06, 0.32, -0.16, titanium)
    bt.location = (x * (W / 2 + 0.03), y, 0)
    parts.append(bt)
for p in parts:
    p.parent = phone

# ── Escena: fondo de estudio continuo (ciclorama): suelo que se curva en pared sin esquina, para que no haya horizonte.
def cyc(y0=-250, y_wall=70, z_floor=-20, rad=60, top=260, half=300, seg=24):
    prof = [(y0, z_floor), (y_wall - rad, z_floor)]
    for i in range(1, seg + 1):
        a = math.pi / 2 * i / seg
        prof.append((y_wall - rad + rad * math.sin(a), z_floor + rad - rad * math.cos(a)))
    prof.append((y_wall, top))
    me = bpy.data.meshes.new("ciclorama"); bm = bmesh.new()
    rows = [[bm.verts.new((x, y, z)) for y, z in prof] for x in (-half, half)]
    for i in range(len(prof) - 1):
        bm.faces.new((rows[0][i], rows[0][i + 1], rows[1][i + 1], rows[1][i]))
    bm.normal_update(); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new("ciclorama", me); bpy.context.collection.objects.link(ob)
    for pl in me.polygons: pl.use_smooth = True
    ob.data.materials.append(wall_m)
cyc()

pivot.location = (0, 0, 14.5)

# ── Luces ───────────────────────────────────────────────────────────────────
def light(name, kind, energy, loc, target, size=1.0, color=(1, 1, 1), spot=None):
    d = bpy.data.lights.new(name, kind); d.energy = energy; d.color = color
    if kind == "AREA": d.size = size
    if kind == "SPOT": d.spot_size = math.radians(spot); d.spot_blend = 0.35; d.shadow_soft_size = size
    ob = bpy.data.objects.new(name, d); bpy.context.collection.objects.link(ob); ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob

AUB = (0.8, 0.45, 0.66)
# Una sola luz focal sobre el móvil, cálida, de arriba y algo de frente: el resto del estudio queda a oscuras.
light("foco", "SPOT", 110000, (-14, -60, 70), (0, 0, 14.5), size=2, spot=9)
# Ventana: solo se ve reflejada en el cristal y lo barre al girar.
win = light("ventana", "AREA", 30000, (34, -62, 52), (0, 0, 14.5), size=30)
win.data.shape = "RECTANGLE"; win.data.size_y = 9
# Luces berenjena que giran con el móvil (hijas del pivote): dos recortes que dibujan el canto y un halo en el sin
# fin, detrás, que se desliza de lado a lado con el giro.
rigs = [
    light("recorte-izq", "AREA", 60000, (-24, 30, 22), (0, 0, 14.5), size=1.2, color=AUB),
    light("recorte-der", "AREA", 45000, (26, 28, 26), (0, 0, 14.5), size=1.2, color=(1, 0.9, 0.95)),
    light("halo", "SPOT", 700000, (-4, -10, 40), (4, 70, -6), size=12, spot=30, color=AUB),
]
rigs[2].data.spot_blend = 0.9
for l in rigs[:2]:
    l.data.shape = "RECTANGLE"; l.data.size_y = 30
for l in rigs:
    l.parent = pivot; l.matrix_parent_inverse = pivot.matrix_world.inverted()
# Para que el fondo quede negro, las luces del móvil solo dan brillos (el titanio y el cristal son espejos): no
# iluminan el sin fin. Lo único que lo toca es el halo.
for name in ("foco", "ventana", "recorte-izq", "recorte-der"):
    bpy.data.objects[name].visible_diffuse = False
sc.world = bpy.data.worlds.new("mundo"); sc.world.use_nodes = True
sc.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 1)

# ── Cámara ──────────────────────────────────────────────────────────────────
cam_d = bpy.data.cameras.new("camara"); cam_d.lens = 85
cam_d.dof.use_dof = True; cam_d.dof.aperture_fstop = 4.0
cam = bpy.data.objects.new("camara", cam_d); bpy.context.collection.objects.link(cam)
cam.location = (0, -100, 20)
aim = Vector((0, 0, 14.3))
cam.rotation_euler = (aim - cam.location).to_track_quat("-Z", "Y").to_euler()
cam_d.dof.focus_distance = (aim - cam.location).length
sc.camera = cam

# ── Movimiento: se inclina hacia atrás y gira ±35° despacio; flota un poco ──
N = A.frames
sc.frame_start, sc.frame_end = 1, N + A.tail
sc.render.fps = 30
def pose(f):
    t = (f - 1) / N
    pivot.rotation_euler = (0, 0, math.radians(35 * math.sin(2 * math.pi * t)))
    pivot.location.z = 14.5 + 0.35 * math.sin(2 * math.pi * t + 1.2)
for f in range(1, N + A.tail + 1):
    pose(f); pivot.keyframe_insert("rotation_euler", frame=f); pivot.keyframe_insert("location", frame=f)

# ── Render ──────────────────────────────────────────────────────────────────
r = sc.render; r.engine = "CYCLES"; r.resolution_x, r.resolution_y = A.w, A.h
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"; prefs.refresh_devices()
for d in prefs.devices: d.use = d.type == "METAL"
sc.cycles.device = "GPU"; sc.cycles.samples = A.samples; sc.cycles.use_denoising = True
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
r.use_motion_blur = not A.stills; r.motion_blur_shutter = 0.5
r.image_settings.file_format = "PNG"

if A.stills:
    for f in (1, N // 4, N // 2 + N // 8, 3 * N // 4):
        sc.frame_set(f); r.filepath = f"{A.out}/still-{f:03d}.png"
        bpy.ops.render.render(write_still=True)
else:
    r.filepath = f"{A.out}/f-"
    bpy.ops.render.render(animation=True)
