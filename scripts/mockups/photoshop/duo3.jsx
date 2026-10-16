// iPhone Duo (Pixeden): fondo neutro claro y dos salidas, pantalla negra y pantalla magenta (para la máscara).
app.displayDialogs = DialogModes.NO;
app.preferences.rulerUnits = Units.PIXELS;
var doc = app.open(new File('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/iphone-duo/Foldable-iPhone-Duo-Smartphone-Stand-Free-PSD-Mockup.psd'));
function find(ls,n){for(var i=0;i<ls.length;i++){if(ls[i].name==n)return ls[i]; if(ls[i].typename=='LayerSet'){var r=find(ls[i].layers,n); if(r) return r;}} return null;}
function setFill(layer, r,g,b){ doc.activeLayer = layer;
  var d=new ActionDescriptor(); var ref=new ActionReference(); ref.putEnumerated(stringIDToTypeID('contentLayer'),charIDToTypeID('Ordn'),charIDToTypeID('Trgt')); d.putReference(charIDToTypeID('null'),ref);
  var c=new ActionDescriptor(); var col=new ActionDescriptor(); var rgb=new ActionDescriptor(); rgb.putDouble(charIDToTypeID('Rd  '),r); rgb.putDouble(charIDToTypeID('Grn '),g); rgb.putDouble(charIDToTypeID('Bl  '),b);
  col.putObject(charIDToTypeID('Clr '),charIDToTypeID('RGBC'),rgb); c.putObject(charIDToTypeID('Clr '),charIDToTypeID('RGBC'),rgb);
  d.putObject(charIDToTypeID('T   '),stringIDToTypeID('solidColorLayer'),c); executeAction(charIDToTypeID('setd'),d,DialogModes.NO); }
var rm = find(doc.layers,'REMOVE THIS LAYER'); if (rm) rm.visible = false;
setFill(find(doc.layers,'Backgrund Color'), 252,252,252); find(doc.layers,'Overlay Shadow Background').visible = false;
var so = find(doc.layers,'PUT YOUR SCREEN HERE'); doc.activeLayer = so;
executeAction(stringIDToTypeID('placedLayerEditContents'), new ActionDescriptor(), DialogModes.NO);
var s = app.activeDocument; var info = 'so ' + s.width + 'x' + s.height;
function fillSO(r,g,b){ app.activeDocument = s; var c=new SolidColor(); c.rgb.red=r; c.rgb.green=g; c.rgb.blue=b;
  var l = s.artLayers.add(); s.selection.selectAll(); s.selection.fill(c); s.selection.deselect(); s.save(); app.activeDocument = doc; }
function exp(path){ var o=new PNGSaveOptions(); doc.saveAs(new File(path), o, true, Extension.LOWERCASE); }
app.activeDocument = s; var src = app.open(new File('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/iphone-duo/markers.png')); src.selection.selectAll(); src.flatten(); src.selection.copy(); src.close(SaveOptions.DONOTSAVECHANGES);
app.activeDocument = s; s.paste(); s.save(); app.activeDocument = doc;
var hide = find(doc.layers,'Glare Screen'); if (hide) hide.visible = false;
exp('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/iphone-duo/duo-markers.png');

app.activeDocument = s; s.close(SaveOptions.DONOTSAVECHANGES);
doc.close(SaveOptions.DONOTSAVECHANGES);
info;
