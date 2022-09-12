import remove from "rollup-plugin-delete";
import {resolve} from "node:path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import scss from 'rollup-plugin-scss'

export default {
    input: resolve("src", "Dropzone.ts"),
    plugins: [
        remove({targets: resolve("lib", "*")}),
        typescript(),
        terser(),
        scss()
    ],
    output: {
        file: resolve("lib", "Dropzone.js"),
        format: "cjs"
    }
}