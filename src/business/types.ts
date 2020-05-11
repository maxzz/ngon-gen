export type Point2D = {
    x: number;
    y: number;
}

export interface SavedScene { // Persistent format of Scene
    w: number;        // Scene.w
    h: number;        // Scene.h
    z?: number;       // Scene.scale
    cx?: number;      // Scene.ofsX
    cy?: number;      // Scene.ofsY
}

export interface SavedNgon { // Persistent format of ShapeParams
    na: number;       // ShapeNgon.nOuter
    nb: number;       // ShapeNgon.nInner
    lna: Point2D;     // ShapeNgon.lenOuter
    lnb: Point2D;     // ShapeNgon.lenInner
    stk?: number;     //
    scn: SavedScene;  //
    gen?: string;     // ShapeNgon.gen
    id?: string;      // ShapeNgon.id
}

export type Scene = {
    w: number;        // Scene width
    h: number;        // Scene height
    scale: number;    // Scene scale, zoom
    ofsX: number;     // Center offset X (from top left corner)
    ofsY: number;     // Center offset Y (from top left corner)
}

export type ShapeNgon = {
    nOuter: number;     // Number of outer points
    nInner: number;     // Number of inner points
    lenOuter: Point2D;  // length outer vector
    lenInner: Point2D;  // length inner vector

    scene: Scene;       // Scene params

    //offset: Point2D;
    sceneSize: Point2D;
    sceneScale: number;

        stroke: number; // Stroke width
        gen?: string; // Generator name: 'ngon'

    id: string;         // Relatively unique shape ID or generated
}

export function ShapeNgonToSaved(p: ShapeNgon): SavedNgon {
    let rv: SavedNgon = {
        na: p.nOuter,
        nb: p.nInner,
        lna: p.lenOuter,
        lnb: p.lenInner,
        scn: {
            w: p.sceneSize.x,
            h: p.sceneSize.y,
            ...(p.sceneScale !== 1 && { z: p.sceneScale }),
            ...(p.scene.ofsX !== p.sceneSize.x / 2 && { cx: p.scene.ofsX }),
            ...(p.scene.ofsY !== p.sceneSize.y / 2 && { cy: p.scene.ofsY }),
        },
        ...(p.stroke !== CONST.DEF_STROKE && { stk: p.stroke }),
        ...(p.gen && p.gen !== CONST.NAME_NGON && { gen: p.gen }),
        id: p.id
    };
    return rv;
}

export function ShapeNgonFromSaved(p: SavedNgon, id?: number): ShapeNgon {
    let w = p.scn && p.scn.w || SCENE_SIZE;
    let h = p.scn && p.scn.h || SCENE_SIZE;
    let rv: ShapeNgon = {
        nOuter: ((p as any).nOuter && +(p as any).nOuter) || p.na,
        nInner: ((p as any).nInner && +(p as any).nInner) || p.nb,
        lenOuter: ((p as any).lenOuter && (p as any).lenOuter) || p.lna,
        lenInner: ((p as any).lenInner && (p as any).lenInner) || p.lnb,

        scene: {
            w: w,
            h: h,
            scale: ((p as any).sceneScale && +(p as any).sceneScale) || p.scn && p.scn.z || 1,
            ofsX: ((p as any).offset && +(p as any).offset.x) || p.scn && p.scn.cx || w / 2,
            ofsY: ((p as any).offset && +(p as any).offset.y) || p.scn && p.scn.cy || h / 2,
        },
            sceneSize: {
                x: w,
                y: h,
            },
            sceneScale: ((p as any).sceneScale && +(p as any).sceneScale) || p.scn && p.scn.z || 1,

        stroke: p.stk || CONST.DEF_STROKE,
        gen: p.gen || CONST.NAME_NGON,
        id: p.id || uniqueId(id),
    };
    return rv;
}

export const SCENE_SIZE = 14; // should be even integer

const enum CONST {
    DEF_STROKE = 0.2,
    NAME_NGON = 'ngon',
};

export const initialParams: ShapeNgon = {
    nOuter: 5,
    nInner: 2,
    lenOuter: { x: 2.2, y: 2.2 },
    lenInner: { x: 5.2, y: 5.2 },

    scene: {
        w: SCENE_SIZE,
        h: SCENE_SIZE,
        scale: 1,
        ofsX: SCENE_SIZE / 2,
        ofsY: SCENE_SIZE / 2,
    },
        sceneSize: {x: SCENE_SIZE, y: SCENE_SIZE },
        sceneScale: 1,
        stroke: CONST.DEF_STROKE as number,

    id: uniqueId()
};

function uniqueId(v?: number): string {
    return (v || Date.now()).toString(36); // v is for balk generation within 1ms.
}

export function fixImportedShape(p: ShapeNgon): ShapeNgon {
    // defaults for missing keys
//!p.id && (p.id = uniqueId(id));
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

    p.scene.ofsX = +p.scene.ofsX || p.scene.w / 2;
    p.scene.ofsY = +p.scene.ofsY || p.scene.h / 2;

// temp for old shapes:
    let ofs: Point2D = (p.scene as any).offset;
    if (ofs) { // conver string to numbers
        ofs.x = +ofs.x;
        ofs.y = +ofs.y;
    } else {
        (p as any).offset = {x: 7, y: 7};
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
        scene: {
            w: p.scene && +p.scene.w || SCENE_SIZE,
            h: p.scene && +p.scene.h || SCENE_SIZE,
            scale: p.scene && +p.scene.scale || 1,
            ofsX: p.scene && +p.scene.ofsX || SCENE_SIZE / 2,
            ofsY: p.scene && +p.scene.ofsY || SCENE_SIZE / 2,
        },
//            offset: { x: +p.offset.x, y: +p.offset.y },
            sceneSize: {x: p.sceneSize.x, y: p.sceneSize.y},
            sceneScale: +p.sceneScale || 1, // we need default since it was not stored before
            stroke: +p.stroke,

        id: p.id
    };

// temp for old shapes:    
//    (rv as any).offset = { x: +(p as any).offset.x, y: +(p as any).offset.y };

    return rv;
}
