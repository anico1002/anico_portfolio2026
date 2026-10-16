// Mano 3D (PSD de Alberto): exporta la mano oscura sin fondo, la pantalla en magenta (máscara) y marcas (homografía).
app.displayDialogs = DialogModes.NO; app.preferences.rulerUnits = Units.PIXELS;
var doc = app.open(new File('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/hand-3d/hand.psd'));
function find(ls,n){for(var i=0;i<ls.length;i++){if(ls[i].name==n)return ls[i]; if(ls[i].typename=='LayerSet'){var r=find(ls[i].layers,n); if(r) return r;}} return null;}
find(doc.layers,'Light').visible=false; find(doc.layers,'Color').visible=false;
var dk=find(doc.layers,'Dark'); dk.visible=true; dk.layers.getByName('Dark bg').visible=false;
var so=doc.layers[0]; var info='so '+so.name;
function exp(p){ doc.saveAs(new File(p), new PNGSaveOptions(), true, Extension.LOWERCASE); }
so.visible=false; exp('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/hand-3d/hand-dark.png');
so.visible=true; doc.activeLayer=so;
executeAction(stringIDToTypeID('placedLayerEditContents'), new ActionDescriptor(), DialogModes.NO);
var s=app.activeDocument; info+=' '+s.width+'x'+s.height;
function fill(r,g,b){ app.activeDocument=s; var c=new SolidColor(); c.rgb.red=r;c.rgb.green=g;c.rgb.blue=b; s.artLayers.add(); s.selection.selectAll(); s.selection.fill(c); s.selection.deselect(); s.save(); app.activeDocument=doc; }
fill(255,0,255); exp('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/hand-3d/hand-magenta.png');
app.activeDocument=s; var src=app.open(new File('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/hand-3d/markers.png')); src.resizeImage(s.width,s.height,s.resolution,ResampleMethod.NEARESTNEIGHBOR); src.selection.selectAll(); src.flatten(); src.selection.copy(); src.close(SaveOptions.DONOTSAVECHANGES);
app.activeDocument=s; s.paste(); s.save(); app.activeDocument=doc; exp('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/hand-3d/hand-markers.png');
app.activeDocument=s; s.close(SaveOptions.DONOTSAVECHANGES); doc.close(SaveOptions.DONOTSAVECHANGES); info;
