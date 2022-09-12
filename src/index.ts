import { Dropzone } from "./Dropzone";
import "../style.scss";

const form = document.querySelector("form");
const fileInput: HTMLInputElement = form!.querySelector(".dropzone")!;

const dropzone = new Dropzone(fileInput, { label: "Envoyez vos fichiers ici" });

dropzone.on("removeFile", console.log);
