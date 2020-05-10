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
