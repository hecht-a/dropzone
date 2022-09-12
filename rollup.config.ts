import remove from "rollup-plugin-delete";
import {resolve} from "node:path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import scss from 'rollup-plugin-scss'
import copy from "rollup-plugin-copy";

export default {
    input: resolve("src", "Dropzone.ts"),
    plugins: [
        remove({targets: resolve("lib", "*")}),
        typescript(),
        terser(),
        scss({
            output: './lib/style.css'
        }),
        copy({
            targets: [
                {src: './style.scss', dest: 'lib'}
            ]
        })
    ],
    output: {
        file: resolve("lib", "Dropzone.js"),
        format: "cjs"
    }
}