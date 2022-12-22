import remove from "rollup-plugin-delete";
import {resolve} from "node:path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import scss from 'rollup-plugin-scss';
import copy from "rollup-plugin-copy";

export default {
    input: resolve("src", "index.ts"),
    plugins: [
        remove({targets: resolve("lib", "*")}),
        typescript(),
        terser(),
        scss({
            include: resolve("src", "style.scss"),
            output: './lib/style.css'
        }),
        copy({
            targets: [
                {src: resolve("src", "style.scss"), dest: 'lib'}
            ]
        }),
        copy({
            targets: [
                {src: resolve("index.html"), dest: 'lib'}
            ]
        })
    ],
    output: {
        file: resolve("lib", "index.js"),
        format: "cjs"
    }
}