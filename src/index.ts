import { Dropzone } from "./Dropzone";

const form = document.querySelector("form");
const fileInput: HTMLInputElement = form!.querySelector(".dropzone")!;

const dropzone = new Dropzone(fileInput, {});

dropzone.on("drop", (files) => {
	console.log(files);
});

dropzone.on("addFile", (file) => {
	console.log(file);
});

dropzone.on("addFiles", (files) => {
	console.log(files);
});
