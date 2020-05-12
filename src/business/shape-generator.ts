import * as types from "./types";
import { CONST, checkNumbers } from './types';

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

export function generate(params: types.ShapeNgon) {
    const p: types.ShapeNgon = checkNumbers(params);

    // generate points
    let points = ngon(p.nOuter * p.nInner);

    // scale move
    points = points.map((_, index) => {
        return index % p.nInner === 0 
            ? [ _[0] * p.lenInner.x, _[1] * p.lenInner.y ] 
            : [ _[0] * p.lenOuter.x, _[1] * p.lenOuter.y ];
    });

    // scene scale
    points = points.map((_, index) => {
        return [ _[0] * p.scene.scale, _[1] * p.scene.scale ];
    });

    // offset
    points = points.map(_ => [ _[0] + p.scene.ofsX, _[1] + p.scene.ofsY ]);

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
            cx: points[0][0],
            cy: points[0][1],
        },
        center: {
            x: CONST.sceneSize / 2,
            y: CONST.sceneSize / 2,
        }
    };
}
