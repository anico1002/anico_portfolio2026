"""Rejilla isométrica de móviles negros tumbados con capturas dentro (Benchmark de Gloop, 2026-10-14).
Uso: python3 scripts/mockups/iso_grid.py mockups-src/benchmark public/maqueta/gloop/media/benchmark.jpg
Las capturas (t0…t9.png, ya sin márgenes) son pantallazos de apps de eventos que juntó Alberto; cada una se
recorta a la proporción del iPhone (INSET quita restos de marco). Sin PSD: la perspectiva se hace aquí."""
import sys, numpy as np, cv2
SP=sys.argv[1]; OUT=sys.argv[2]
SW,SH=400,866                     # pantalla en el plano (proporción iPhone)
BZ=16; R_OUT=70; R_IN=56          # bisel y radios
PW,PH=SW+2*BZ,SH+2*BZ
INSET={3:0.05,5:0.03,6:0.04,7:0.03}  # capturas con restos de marco: recorte extra
def screen(i):
    im=cv2.imread(f'{SP}/t{i}.png').astype(np.float32)/255
    h,w=im.shape[:2]; ins=INSET.get(i,0.012)
    im=im[int(h*ins):h-int(h*ins), int(w*ins):w-int(w*ins)]
    h,w=im.shape[:2]; target=SH/SW
    if h/w>target: nh=int(w*target); y0=(h-nh)//2; im=im[y0:y0+nh]
    else: nw=int(h/target); x0=(w-nw)//2; im=im[:,x0:x0+nw]
    return cv2.resize(im,(SW,SH),interpolation=cv2.INTER_CUBIC)
def rrect(w,h,r):
    m=np.zeros((h,w),np.float32)
    cv2.rectangle(m,(r,0),(w-r,h),1,-1); cv2.rectangle(m,(0,r),(w,h-r),1,-1)
    for x,y in ((r,r),(w-r,r),(w-r,h-r),(r,h-r)): cv2.circle(m,(x,y),r,1,-1,cv2.LINE_AA)
    return m
body=rrect(PW,PH,R_OUT); scrm=rrect(SW,SH,R_IN)
def phone(i):
    rgb=np.zeros((PH,PW,3),np.float32)+0.035
    s=screen(i)*0.92
    a=scrm[...,None]; rgb[BZ:BZ+SH,BZ:BZ+SW]=rgb[BZ:BZ+SH,BZ:BZ+SW]*(1-a)+s*a
    # isla dinámica
    cv2.ellipse(rgb,(PW//2,BZ+30),(60,17),0,0,360,(0.02,0.02,0.02),-1,cv2.LINE_AA)
    # canto de luz fino
    edge=rrect(PW,PH,R_OUT)-cv2.erode(rrect(PW,PH,R_OUT),np.ones((5,5),np.uint8))
    rgb=rgb+edge[...,None]*0.18
    return rgb, body
# plano
order=[5,2,7,4,0,9,6,3,8,1,5,7,2,0,9,4]
CW,CH=4200,4200; plane=np.zeros((CH,CW,3),np.float32); alpha=np.zeros((CH,CW),np.float32)
gx,gy=PW+70,PH+70; k=0
for row in range(-1,5):
    for col in range(-1,8):
        x=600+col*gx+(row%2)*gx//2; y=300+row*gy
        if x<0 or y<0 or x+PW>CW or y+PH>CH: continue
        rgb,a=phone(order[k%len(order)]); k+=1
        sl=(slice(y,y+PH),slice(x,x+PW))
        plane[sl]=plane[sl]*(1-a[...,None])+rgb*a[...,None]; alpha[sl]=np.maximum(alpha[sl],a)
# proyección isométrica (el plano tumbado, girado 45° y aplastado)
ang=np.radians(-38); c,s=np.cos(ang),np.sin(ang)
M=np.float32([[c,-s,0],[s*0.55,c*0.55,0]])
W,H=1800,1125; S=0.62
M=M*S; M[0,2]=W/2-(M[0,0]*CW/2+M[0,1]*CH/2); M[1,2]=H/2-(M[1,0]*CW/2+M[1,1]*CH/2)
warp=lambda im: cv2.warpAffine(im,M,(W,H),flags=cv2.INTER_AREA)
P=warp(plane); A=np.clip(warp(alpha),0,1)[...,None]
bg=np.zeros((H,W,3),np.float32)+np.array([0.035,0.03,0.045],np.float32)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
bg+= (np.exp(-(((xx-W*0.3)/(W*0.5))**2+((yy-H*0.2)/(H*0.6))**2))*0.06)[...,None]*np.array([0.9,0.5,1.0],np.float32)
# sombra y grosor (el canto del móvil hacia abajo)
sh=cv2.GaussianBlur(np.roll(A[...,0],18,axis=0),(0,0),14)[...,None]
out=bg*(1-0.75*sh)
T=12
for t in range(T,0,-1):
    At=np.roll(A[...,0],t,axis=0)[...,None]
    col=0.05+0.10*(1-t/T)
    out=out*(1-At)+col*At
out=out*(1-A)+P*A
cv2.imwrite(OUT,np.clip(out*255,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,90])
