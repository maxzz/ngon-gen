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

export function rnd2(n: number): number {
    return Math.round(n * 100) / 100;
}

export function generate(p: types.ShapeParams) {
    //console.log('generate: sp', p);

    const sp: types.ShapeParams = {
        lenOuter: { x: +p.lenOuter.x, y: +p.lenOuter.y },
        lenInner: { x: +p.lenInner.x, y: +p.lenInner.y },
        offset: { x: +p.offset.x, y: +p.offset.y },
        nOuter: +p.nOuter,
        nInner: +p.nInner,
        sceneScale: +p.sceneScale || 1, // we need default since it was not stored before
        id: p.id
    };

    // generate points
    let points = ngon(sp.nOuter * sp.nInner);

    // scale move
    points = points.map((_, index) => {
        return index % sp.nInner === 0 
            ? [ _[0] * sp.lenInner.x, _[1] * sp.lenInner.y ] 
            : [ _[0] * sp.lenOuter.x, _[1] * sp.lenOuter.y ];
    });

    // scene scale
    points = points.map((_, index) => {
        return [ _[0] * sp.sceneScale, _[1] * sp.sceneScale ];
    });

    // offset
    points = points.map(_ => [ _[0] + sp.offset.x, _[1] + sp.offset.y ]);

    // round
    points = points.map(_ => [ rnd2(_[0]), rnd2(_[1])]);

    // generate line
    let d = `M${points[0][0]},${points[0][1]}` + points.map((_, index) => {
        return !index ? '' : `L${_[0]},${_[1]}`;
    }).join('') + `z`;

    return {
        d,
        points,
        start: {
            cx: ''+points[0][0],
            cy: ''+points[0][1],
        },
        center: {
            x: 7,
            y: 7,
        }
    };
}
