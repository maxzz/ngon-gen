import { ref } from '@vue/composition-api';
import * as types from "./types";
import { shapeLines as defaultShapes } from './def-shapes';

export function initShapes(sp: types.ShapeParams) {
    let shapes = ref<types.ShapeParams[]>([]);

    defaultShapes.forEach(_ => {
        try {
            shapes.value.push(JSON.parse(_));
        } catch (error) {
            console.log(`Bad shape: "${_}"`);
        }
    });

    function saveShape() {
        shapes.value.push(JSON.parse(JSON.stringify(sp)));
    }

    function applyShape(shape: types.ShapeParams) {
        let upd = JSON.parse(JSON.stringify(shape));
        sp.nOuter= upd.nOuter;
        sp.nInner= upd.nInner;
        sp.lenOuter = upd.lenOuter;
        sp.lenInner = upd.lenInner;
        sp.offset= upd.offset;
    }

    return {
        saveShape,
        applyShape,
        shapes
    };
} //initShapes()
