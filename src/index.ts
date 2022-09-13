import { Dropzone } from "./Dropzone";
import "../style.scss";

const form = document.querySelector("form");
const fileInput1: HTMLInputElement = form!.querySelector("#file")!;

const dropzone = new Dropzone(fileInput1, { label: "Envoyez vos fichiers ici" });

document.querySelector("button")!.addEventListener("click", () => {
	dropzone.clearFiles();
});

dropzone.on("removeFile", console.log);
