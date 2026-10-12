#!/bin/bash
# ui.sh — lista botones/textos visibles con su marco
S=$(dirname "$0"); $S/axe/axe describe-ui --udid ${SIM:-$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')} 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
def walk(n):
    l=(n.get('AXLabel') or '').replace('\n',' '); t=n.get('type'); f=n.get('frame',{})
    if t in ('Button','Switch','TextField','Cell','Tab') or (l and t=='StaticText' and f.get('height',0)>20):
        print(f\"{t} '{l[:45]}' {round(f.get('x',0))},{round(f.get('y',0))} {round(f.get('width',0))}x{round(f.get('height',0))}\")
    for c in n.get('children',[]): walk(c)
for n in (d if isinstance(d,list) else [d]): walk(n)
"
