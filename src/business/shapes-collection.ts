import { ref, computed } from '@vue/composition-api';
import * as types from "./types";
import { shapeLines as defaultShapes } from './def-shapes';
import { fixImportedShape, ShapeNgonFromSaved, ShapeNgonToSaved, uniqueId } from './types';

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

    function shapeAddToPreview() {
        let newShape = JSON.parse(JSON.stringify(sp));
        newShape.id = types.uniqueId();
        shapes.value.push(newShape);
    }

    function shapeFromPreview(shape: types.ShapeNgon) {
        let upd = JSON.parse(JSON.stringify(shape)) as types.ShapeNgon;
        
        for (let [key, val] of Object.entries(upd)) {
            (sp as any)[key] = val;
        }
    }

    let _DebugExport = computed(() => {
        function printShapes() {
            let shapeStrs = shapes.value.map((_, index) => {
                let shape = ShapeNgonToSaved(_);
                return `/*${index < 9 ? '0': ''}${index+1}*/ '${JSON.stringify(shape)}'`;
            });
            let s = `[\n  ${shapeStrs.join(',\n  ')},\n]\n`;
            console.log(s);
        }
        printShapes();

        let newShape = ShapeNgonToSaved(sp);
        let oldId = newShape.id;
        newShape.id = uniqueId();
        let s = `/*${shapes.value.length}*/'${JSON.stringify(newShape)}', //prev "id": ${oldId}`;
        console.log(s);
        return s;
    });

    return {
        shapes,
        shapeAddToPreview,
        shapeFromPreview,
        _DebugExport,
    };
} //initShapes()

export function generatedSvg(path: string, stroke: number) {
    let style = `<style> path { stroke-width: ${stroke}; fill: none; stroke: red; } </style>`;
    return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">\n    <path d="${path}"/>\n    ${style}\n</svg>`;
}
