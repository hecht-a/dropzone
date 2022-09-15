import { Dropzone } from "./Dropzone";
import "../style.scss";

const form = document.querySelector("form");
const fileInput1: HTMLInputElement = form!.querySelector("#file")!;

const dropzone = new Dropzone(fileInput1, { label: "Envoyez vos fichiers ici", min: 0, max: 0 });

document.querySelector("button")!.addEventListener("click", () => {
	dropzone.clearFiles();
});

dropzone.on("addFile", console.log);
dropzone.on("error", console.log);
