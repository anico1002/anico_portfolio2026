#!/usr/bin/env python3
"""Sube deploy/apache-out/ al servidor de MindYourGap (anico.es) por FTP, solo lo nuevo o cambiado (2026-11-01).

La primera subida (2026-10-30) fue entera (656 MB). Esta compara con lo que hay en el servidor: sube los archivos que
faltan o cuyo tamaño cambió, y siempre los de texto (html, css, js, json, txt, xml, .htaccess), que pesan poco y
pueden cambiar sin cambiar de tamaño. No borra nada en el servidor.

La contraseña sale del Llavero (servicio `anico-es-ftp`, lo guarda deploy/guardar-acceso-ftp.sh); nunca se imprime.
Uso: python3 deploy/subir-ftp.py [--dry]
"""
import ftplib, os, subprocess, sys

HOST, USER, REMOTE = "134.0.9.249", "anico62", "web"
LOCAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apache-out")
TEXT = (".html", ".css", ".js", ".json", ".txt", ".xml", ".htaccess", ".webmanifest", ".svg")
DRY = "--dry" in sys.argv

pw = subprocess.check_output(["security", "find-generic-password", "-s", "anico-es-ftp", "-a", USER, "-w"]).decode().strip()
ftp = ftplib.FTP(HOST, timeout=60)
ftp.login(USER, pw)
ftp.voidcmd("TYPE I")


def remote_sizes(path):
    """Tamaños de todo lo que hay bajo `path` en el servidor: {ruta relativa: bytes}."""
    out = {}
    try:
        entries = list(ftp.mlsd(path, facts=["type", "size"]))
    except ftplib.error_perm:
        return out
    for name, f in entries:
        if name in (".", ".."):
            continue
        p = f"{path}/{name}"
        if f.get("type") == "dir":
            out.update(remote_sizes(p))
        elif f.get("type") == "file":
            out[p[len(REMOTE) + 1:]] = int(f.get("size", -1))
    return out


print("leyendo el servidor…", flush=True)
have = remote_sizes(REMOTE)
todo = []
for root, _, files in os.walk(LOCAL):
    for fn in files:
        lp = os.path.join(root, fn)
        rel = os.path.relpath(lp, LOCAL).replace(os.sep, "/")
        size = os.path.getsize(lp)
        if rel not in have or have[rel] != size or fn.endswith(TEXT) or fn == ".htaccess":
            todo.append((rel, lp, size))
print(f"en el servidor: {len(have)} archivos · a subir: {len(todo)} ({sum(s for *_, s in todo) / 1e6:.1f} MB)", flush=True)
if DRY:
    sys.exit(0)

made = set()


def ensure(dirpath):
    parts = dirpath.split("/")
    for i in range(1, len(parts) + 1):
        d = "/".join(parts[:i])
        if d in made:
            continue
        try:
            ftp.mkd(d)
        except ftplib.error_perm:
            pass
        made.add(d)


for k, (rel, lp, _) in enumerate(todo, 1):
    ensure(os.path.dirname(f"{REMOTE}/{rel}"))
    with open(lp, "rb") as fh:
        ftp.storbinary(f"STOR {REMOTE}/{rel}", fh)
    if k % 100 == 0 or k == len(todo):
        print(f"  {k}/{len(todo)}", flush=True)
ftp.quit()
print("ok")
