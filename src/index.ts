import { Dropzone } from "./Dropzone";
import "../style.scss";

const form = document.querySelector("form");
const fileInput1: HTMLInputElement = form!.querySelector("#file")!;
const fileInput2: HTMLInputElement = form!.querySelector("#file2")!;

const dz1 = new Dropzone(fileInput1, { label: "Envoyez vos fichiers ici", id: "dz1" });
const dz2 = new Dropzone(fileInput2, { label: "Envoyez vos fichiers ici", id: "dz2" });

dz1.on("removeFile", console.log);
dz2.on("removeFile", console.log);
