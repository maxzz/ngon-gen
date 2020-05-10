export type Point2D = {
    x: number;
    y: number;
}

interface SavedScene { // Persistent format of Scene
    w: number;        // Scene.w
    h: number;        // Scene.h
    z?: number;       // Scene.scale
    cx?: number;      // Scene.ofsX
    cy?: number;      // Scene.ofsY
}

interface SavedNgon { // Persistent format of ShapeParams
    na: number;       // nOuter
    nb: number;       // nInner
    lna: Point2D;     // lenOuter
    lnb: Point2D;     // lenInner
    stk?: number;     // Stroke width
    scn: SavedScene;  // Scene params
    gen?: string;     // Generator name: 'ngon'
    id?: string;      // Relatively unique shape ID or generated
}

export type Scene = {
    ofsX: number;   // center offset X (from top left corner)
    ofsY: number;   // center offset Y (from top left corner)
    w: number;      // scene width
    h: number;      // scene height
    scale: number;  // scene scale, zoom
}

export type ShapeNgon = {
    nOuter: number;
    nInner: number;
    lenOuter: Point2D;
    lenInner: Point2D;

        scene?: Scene;

    offset: Point2D;
    sceneSize: Point2D;
    sceneScale: number;

        stroke?: number;
        gen?: string;

    id: string;
}

function ShapeNgonToSaved(p: ShapeNgon): SavedNgon {
    let rv: SavedNgon = {
        na: p.nOuter,
        nb: p.nInner,
        lna: p.lenOuter,
        lnb: p.lenInner,
        scn: {
            w: p.sceneSize.x,
            h: p.sceneSize.y,
            ...(p.sceneScale !== 1 && { z: p.sceneScale }),
            ...(p.offset.x !== p.sceneSize.x / 2 && { cx: p.offset.x }),
            ...(p.offset.y !== p.sceneSize.y / 2 && { cy: p.offset.y }),
        },
        ...(p.stroke !== 1 && { stk: p.stroke }),
        ...(p.gen && p.gen !== PARAMS_NGON && { gen: p.gen }),
        id: p.id
    };
    return rv;
}

function ShapeNgonFrmoSaved(p: SavedNgon, id?: number): ShapeNgon {
    let rv: ShapeNgon = {
        nOuter: p.na,
        nInner: p.nb,
        lenOuter: p.lna,
        lenInner: p.lnb,
        sceneSize: {
            x: p.scn.w,
            y: p.scn.h,
        },
        sceneScale: p.scn.z || 1,
        offset: {
            x: p.scn.cx || p.scn.w / 2,
            y: p.scn.cy || p.scn.h / 2,
        },
        stroke: p.stk || DEF_STROKE,
        gen: p.gen || PARAMS_NGON,
        id: p.id || uniqueId(id),
    };
    return rv;
}

export const SCENE_SIZE = 14; // should be even integer
const DEF_STROKE = .2;
const PARAMS_NGON = 'ngon';

export const initialParams: ShapeNgon = {
    nOuter: 5,
    nInner: 2,
    lenOuter: { x: 2.2, y: 2.2 },
    lenInner: { x: 5.2, y: 5.2 },
    offset: { x: 7, y: 7 },
    sceneSize: {x: SCENE_SIZE, y: SCENE_SIZE },
    sceneScale: 1,
    id: uniqueId()
};

function uniqueId(v?: number): string {
    return (v || Date.now()).toString(36); // v is for balk generation within 1ms.
}

export function fixImportedShape(p: ShapeNgon, id: number): ShapeNgon {
    // defaults for missing keys
    !p.id && (p.id = uniqueId(id));
    !p.sceneScale && (p.sceneScale = 1);
    !p.sceneSize && (p.sceneSize = {x: SCENE_SIZE, y: SCENE_SIZE});

    if (p.lenInner) { // conver string to numbers
        p.lenInner.x = +p.lenInner.x;
        p.lenInner.y = +p.lenInner.y;
    }

    if (p.lenOuter) { // conver string to numbers
        p.lenOuter.x = +p.lenOuter.x;
        p.lenOuter.y = +p.lenOuter.y;
    }

    //console.log('aa');
    if (p.offset) { // conver string to numbers
        p.offset.x = +p.offset.x;
        p.offset.y = +p.offset.y;
    } else {
        p.offset = {x: 7, y: 7};
    }

    return p;
}

export function checkNumbers(p: ShapeNgon): ShapeNgon {
    // 0. This will check before generate that expected numbers are numbers.
    const rv: ShapeNgon = {
        nOuter: +p.nOuter,
        nInner: +p.nInner,
        lenOuter: { x: +p.lenOuter.x, y: +p.lenOuter.y },
        lenInner: { x: +p.lenInner.x, y: +p.lenInner.y },
        offset: { x: +p.offset.x, y: +p.offset.y },
        sceneSize: {x: p.sceneSize.x, y: p.sceneSize.y},
        sceneScale: +p.sceneScale || 1, // we need default since it was not stored before
        id: p.id
    };
    return rv;
}
