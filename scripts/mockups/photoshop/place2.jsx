// Abre el objeto inteligente, mete la captura a tamaño de lienzo encima de todo, guarda y exporta.
app.displayDialogs = DialogModes.NO;
app.preferences.rulerUnits = Units.PIXELS;
var doc = app.open(new File(PSD_PATH));
function find(ls,n){for(var i=0;i<ls.length;i++){if(ls[i].name==n)return ls[i]; if(ls[i].typename=='LayerSet'){var r=find(ls[i].layers,n); if(r) return r;}} return null;}
doc.activeLayer = find(doc.layers, LAYER_NAME);
executeAction(stringIDToTypeID('placedLayerEditContents'), new ActionDescriptor(), DialogModes.NO);
var so = app.activeDocument;
var info = 'so ' + so.width + 'x' + so.height + ' res ' + so.resolution;
var src = app.open(new File(SCREEN));
src.resizeImage(so.width, so.height, so.resolution, ResampleMethod.BICUBIC);
src.selection.selectAll(); src.flatten(); src.selection.copy();
src.close(SaveOptions.DONOTSAVECHANGES);
app.activeDocument = so;
so.paste();
so.activeLayer.move(so.layers[0], ElementPlacement.PLACEBEFORE);
so.save(); so.close(SaveOptions.DONOTSAVECHANGES);
app.activeDocument = doc;
var o = new JPEGSaveOptions(); o.quality = 11;
doc.saveAs(new File(OUT), o, true, Extension.LOWERCASE);
doc.close(SaveOptions.DONOTSAVECHANGES);
info;
