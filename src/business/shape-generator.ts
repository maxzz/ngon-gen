import * as types from "./types";
import { SCENE_SIZE, checkNumbers } from './types';

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
        return [ _[0] * p.sceneScale, _[1] * p.sceneScale ];
    });

    // offset
    points = points.map(_ => [ _[0] + p.offset.x, _[1] + p.offset.y ]);

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
            x: SCENE_SIZE / 2,
            y: SCENE_SIZE / 2,
        }
    };
}
