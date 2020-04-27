function gon(n: number): [number, number][] {
    let polygon = new Array(n);
    for (var i = n; i--; ) {
        let angle = (360 / n) * i - 90;
        let radians = (angle * Math.PI) / 180;
        polygon[i] = [Math.cos(radians), Math.sin(radians)];
    }
    return polygon;
}

// function ngon(n: number) {
//     return [ [0, 7], [2, 6], [3, 0], [4, 6], [6, 7], [4, 8], [3, 14], [2, 8], [0, 7] ];
// }

function rnd2(n: number): number {
    return Math.round(n * 100) / 100;
}

export function generate() {
    let size = {x: 5, y: 5};
    let sizeInner = {x: 6.2, y: 6.2};

    let offset = {x: 7, y: 7};

    let totalN = 17;
    let innerN = 15;

    // generate points
    let points = gon(totalN * innerN);

    // scale move
    points = points.map((_, index) => index % innerN === 0 ? [ _[0] * sizeInner.x, _[1] * sizeInner.y ] : [ _[0] * size.x, _[1] * size.y ]);

    points = points.map(_ => [ _[0] + offset.x, _[1] + offset.y ]);

    // round
    points = points.map(_ => [ rnd2(_[0]), rnd2(_[1])]);

    // generate line
    let d = `M${points[0][0]},${points[0][1]}` + points.map((_, index) => {
        return !index ? '' : `L${_[0]},${_[1]}`;
    }) + `L${points[0][0]},${points[0][1]}`;

    return {
        d,
        cx: ''+points[0][0],
        cy: ''+points[0][1],
    };
    // starPath.setAttribute('d', d);

    // startPoint.setAttribute('cx', ''+points[0][0]);
    // startPoint.setAttribute('cy', ''+points[0][1]);
}
