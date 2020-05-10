import { ref } from '@vue/composition-api';
import * as types from "./types";
import { shapeLines as defaultShapes } from './def-shapes';
import { SCENE_SIZE } from './types';

export function uniqueId(v?: number): string {
    return (v || Date.now()).toString(36); // v is for balk generation within 1ms.
}

export function initShapes(sp: types.ShapeParams) {
    let shapes = ref<types.ShapeParams[]>([]);

    let initSeed = Date.now();
    defaultShapes.forEach(_ => {
        try {
            let newShape = JSON.parse(_) as types.ShapeParams;

            // defaults for missing keys
            !newShape.id && (newShape.id = uniqueId(initSeed++));
            !newShape.sceneScale && (newShape.sceneScale = 1);
            !newShape.sceneSize && (newShape.sceneSize = {x: SCENE_SIZE, y: SCENE_SIZE});

            if (newShape.lenInner) { // conver string to numbers
                newShape.lenInner.x = +newShape.lenInner.x;
                newShape.lenInner.y = +newShape.lenInner.y;
            }

            if (newShape.lenOuter) { // conver string to numbers
                newShape.lenOuter.x = +newShape.lenOuter.x;
                newShape.lenOuter.y = +newShape.lenOuter.y;
            }

            //console.log('aa');
            if (newShape.offset) { // conver string to numbers
                newShape.offset.x = +newShape.offset.x;
                newShape.offset.y = +newShape.offset.y;
            }

            shapes.value.push(newShape);
        } catch (error) {
            console.log(`Bad shape: "${_}"`);
        }
    });

    function saveShape() {
        shapes.value.push(JSON.parse(JSON.stringify(sp)));
    }

    function applyShape(shape: types.ShapeParams) {
        let upd = JSON.parse(JSON.stringify(shape)) as types.ShapeParams;
        
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
