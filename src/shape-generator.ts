import * as types from "./types";

function ngon(n: number): [number, number][] {
    let polygon = new Array(n);
    for (var i = n; i--; ) {
        let angle = (360 / n) * i - 90;
        let radians = (angle * Math.PI) / 180;
        polygon[i] = [Math.cos(radians), Math.sin(radians)];
    }
    return polygon;
}

function rnd2(n: number): number {
    return Math.round(n * 100) / 100;
}

export function generate(p: types.ShapeParams) {
    console.log('sp', p);

    const sp: types.ShapeParams = {
        lenOuter: { x: +p.lenOuter.x, y: +p.lenOuter.y },
        lenInner: { x: +p.lenInner.x, y: +p.lenInner.y },
        offset: { x: +p.offset.x, y: +p.offset.y },
        nOuter: +p.nOuter,
        nInner: +p.nInner,
    };

    // generate points
    let points = ngon(sp.nOuter * sp.nInner);

    // scale move
    points = points.map((_, index) => {
        return index % sp.nInner === 0 
            ? [ _[0] * sp.lenInner.x, _[1] * sp.lenInner.y ] 
            : [ _[0] * sp.lenOuter.x, _[1] * sp.lenOuter.y ];
    });

    // offset
    points = points.map(_ => [ _[0] + sp.offset.x, _[1] + sp.offset.y ]);

    // round
    points = points.map(_ => [ rnd2(_[0]), rnd2(_[1])]);

    // generate line
    let d = `M${points[0][0]},${points[0][1]}` + points.map((_, index) => {
        return !index ? '' : `L${_[0]},${_[1]}`;
    }) + `z`;

    return {
        d,
        cx: ''+points[0][0],
        cy: ''+points[0][1],
    };
}