import { ref } from '@vue/composition-api';
import * as types from "./types";
import { shapeLines as defaultShapes } from './def-shapes';
import { fixImportedShape, ShapeNgonFromSaved } from './types';

export function initShapes(sp: types.ShapeNgon) {
    let shapes = ref<types.ShapeNgon[]>([]);

    let initSeed = Date.now();
    defaultShapes.forEach((_: string) => {
        try {
            let newShape = fixImportedShape(ShapeNgonFromSaved(JSON.parse(_) as types.SavedNgon, initSeed++));
            shapes.value.push(newShape);
        } catch (error) {
            console.log(`Bad shape: "${_}"`);
        }
    });

    function saveShape() {
        shapes.value.push(JSON.parse(JSON.stringify(sp)));
    }

    function applyShape(shape: types.ShapeNgon) {
        let upd = JSON.parse(JSON.stringify(shape)) as types.ShapeNgon;
        
        for (let [key, val] of Object.entries(upd)) {
            (sp as any)[key] = val;
        }
    }

    return {
        saveShape,
        applyShape,
        shapes
    };
} //initShapes()
