export type LocalPoint = {
    x: number;
    y: number;
}

export type ShapeParams = {
    nOuter: number;
    nInner: number;
    lenOuter: LocalPoint;
    lenInner: LocalPoint;
    offset: LocalPoint;
    sceneSize: LocalPoint;
    sceneScale: number;
    id: string;
}

export const SCENE_SIZE = 14; // should be even integer

export const initialParams: ShapeParams = {
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

export function fixImportedShape(p: ShapeParams, id: number): ShapeParams {
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
    }

    return p;
}

export function checkNumbers(p: ShapeParams): ShapeParams {
    // 0. This will check before generate that expected numbers are numbers.
    const rv: ShapeParams = {
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
