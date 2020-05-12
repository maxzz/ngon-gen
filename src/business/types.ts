export type Point2D = {
    x: number;
    y: number;
}

export interface SavedScene { // Persistent format of Scene
    w: number;          // Scene.w
    h: number;          // Scene.h
    z?: number;         // Scene.scale
    cx?: number;        // Scene.ofsX
    cy?: number;        // Scene.ofsY
}

export interface SavedNgon { // Persistent format of ShapeParams
    na: number;         // ShapeNgon.nOuter
    nb: number;         // ShapeNgon.nInner
    lna: Point2D;       // ShapeNgon.lenOuter
    lnb: Point2D;       // ShapeNgon.lenInner
    stk?: number;       //
    scn: SavedScene;    //
    gen?: string;       // ShapeNgon.gen
    id?: string;        // ShapeNgon.id
}

export type Scene = {
    w: number;          // Scene width
    h: number;          // Scene height
    scale: number;      // Scene scale, zoom
    ofsX: number;       // Center offset X (from top left corner)
    ofsY: number;       // Center offset Y (from top left corner)
}

export type ShapeNgon = {
    nOuter: number;     // Number of outer points
    nInner: number;     // Number of inner points
    lenOuter: Point2D;  // length outer vector
    lenInner: Point2D;  // length inner vector
    scene: Scene;       // Scene params
    stroke: number;     // Stroke width
    gen?: string;       // Generator name: 'ngon'
    id: string;         // Relatively unique shape ID or generated
}

export const enum CONST { // ts defines type by last enum
    defStroke = 0.2,
    sceneSize = 14, // should be an even integer
}

const enum CONST_NAMES {
    NAME_NGON = 'ngon',
}

export function uniqueId(v?: number): string {
    return (v || Date.now()).toString(36); // v is for balk generation within 1ms.
}

export const bootupParams: ShapeNgon = {
    nOuter: 5,
    nInner: 2,
    lenOuter: { x: 2.2, y: 2.2 },
    lenInner: { x: 5.2, y: 5.2 },
    scene: {
        w: CONST.sceneSize,
        h: CONST.sceneSize,
        scale: 1,
        ofsX: CONST.sceneSize / 2,
        ofsY: CONST.sceneSize / 2,
    },
    stroke: CONST.defStroke,
    id: uniqueId()
};

export function ShapeNgonToSaved(p: ShapeNgon): SavedNgon {
    let rv: SavedNgon = {
        na: p.nOuter,
        nb: p.nInner,
        lna: p.lenOuter,
        lnb: p.lenInner,
        scn: {
            w: p.scene.w,
            h: p.scene.h,
            ...(p.scene.scale !== 1 && { z: p.scene.scale }),
            ...(p.scene.ofsX !== p.scene.w / 2 && { cx: p.scene.ofsX }),
            ...(p.scene.ofsY !== p.scene.h / 2 && { cy: p.scene.ofsY }),
        },
        ...(p.stroke !== CONST.defStroke && { stk: p.stroke }),
        ...(p.gen && p.gen !== CONST_NAMES.NAME_NGON && { gen: p.gen }),
        id: p.id
    };
    return rv;
}

export function ShapeNgonFromSaved(p: SavedNgon, id?: number): ShapeNgon {
    let w = p.scn && p.scn.w || CONST.sceneSize;
    let h = p.scn && p.scn.h || CONST.sceneSize;
    let rv: ShapeNgon = {
        nOuter: p.na,
        nInner: p.nb,
        lenOuter: p.lna,
        lenInner: p.lnb,
        scene: {
            w: w,
            h: h,
            scale: p.scn && p.scn.z || 1,
            ofsX: p.scn && p.scn.cx || w / 2,
            ofsY: p.scn && p.scn.cy || h / 2,
        },
        stroke: p.stk || CONST.defStroke,
        gen: p.gen || CONST_NAMES.NAME_NGON,
        id: p.id || uniqueId(id),
    };
    return rv;
}
