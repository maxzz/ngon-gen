export type LocalPoint = {
    x: number;
    y: number;
}

export type ShapeParams = {
    lenOuter: LocalPoint;
    lenInner: LocalPoint;
    offset: LocalPoint;
    nOuter: number;
    nInner: number;
    sceneScale: number;
};
