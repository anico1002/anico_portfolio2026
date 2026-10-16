app.displayDialogs = DialogModes.NO;
var f = new File('/Users/anico/Vibe_Projects/anico_portfolio2026/mockups-src/iphone-duo/Foldable-iPhone-Duo-Smartphone-Stand-Free-PSD-Mockup.psd');
var doc = app.open(f);
var out = [];
function walk(ls, d){ for (var i=0;i<ls.length;i++){ var l=ls[i]; var s=''; for(var k=0;k<d;k++) s+='  ';
  var info = l.typename=='LayerSet' ? 'GROUP' : (''+l.kind);
  var b=''; try{ b=l.bounds.join(',').replace(/ px/g,''); }catch(e){}
  out.push(s+l.name+' | '+info+' | '+l.blendMode+' | op'+Math.round(l.opacity)+' | vis'+l.visible+' | '+b);
  if (l.typename=='LayerSet') walk(l.layers,d+1); } }
walk(doc.layers,0);
doc.close(SaveOptions.DONOTSAVECHANGES);
out.join('\n');
