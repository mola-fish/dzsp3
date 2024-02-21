export function defined(val) {
    return val !== undefined && val !== null;
}
export function defaultValue(val, def) {
    return defined(val) ? val : def;
}
export function cesiumColor(color) {
    if (defined(color))
        return Cesium.Color.fromCssColorString(color);
    return;
}
export function copyToClipboard(text) {
    if (text.indexOf('-') !== -1) {
        let arr = text.split('-');
        text = arr[0] + arr[1];
    }
    const textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? `"${text}" 成功复制到剪贴板'` : '该浏览器不支持点击复制到剪贴板';
        //alert(msg);
        alert(msg);
    }
    catch (err) {
        //alert('该浏览器不支持点击复制到剪贴板');
        alert('该浏览器不支持点击复制到剪贴板');
    }
    ///
    document.body.removeChild(textArea);
}
export function isInPolygon(pts, pt) {
    let bRes = false;
    if (!pts || !pt)
        return bRes;
    let [x1, y1] = pts[0];
    let x2 = 0, y2 = 0;
    let [xl, yl] = pt;
    const count = pts.length;
    for (let i = 1; i < count; ++i) {
        x2 = pts[i][0];
        y2 = pts[i][1];
        if (((y2 <= yl && yl < y1) || (y1 <= yl && yl < y2)) &&
            (xl < ((x1 - x2) * (yl - y2) / (y1 - y2) + x2))) {
            bRes = !bRes;
        }
        x1 = x2;
        y1 = y2;
    }
    return bRes;
}
export async function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
export async function fetchJSON(input, init) {
    const resp = await fetch(input, init);
    return await resp.json();
}
export async function fetchJSON5(input, init) {
    const resp = await fetch(input, init);
    const text = await resp.text();
    const func = new Function("const json5 = \n" + text + ";\n return json5;");
    return func();
}
function findEntity(pc, ent) {
    const len = pc.length;
    for (let i = 0; i < len; ++i) {
        const p = pc.get(i);
        if (p instanceof Cesium.Model) {
            if (p.id === ent)
                return p;
        }
        else if (p instanceof Cesium.PrimitiveCollection) {
            const sp = findEntity(p, ent);
            if (sp)
                return sp;
        }
    }
}
export function findModelByEntity(czviewer, ent) {
    return findEntity(czviewer.scene.primitives, ent);
}
export function dumpPrimitive(pc) {
    const list = [];
    const len = pc.length;
    for (let i = 0; i < len; ++i) {
        const p = pc.get(i);
        if (p instanceof Cesium.Model) {
            list.push(p.id);
        }
        else if (p instanceof Cesium.PrimitiveCollection) {
            list.push(dumpPrimitive(p));
        }
        else {
            list.push(p);
        }
    }
    return list;
}
