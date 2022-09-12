import { Emitter } from "./Emitter";
import { NotInFormError, InvalidElementError, InvalidInputTypeError } from "./Exceptions";
import { options } from "./options";
import { DefaultOptions } from "./types";
import { removeExt } from "./utils";

export class Dropzone extends Emitter {
	private readonly options: typeof options = options;

	constructor(private element: HTMLInputElement, options: DefaultOptions) {
		super();
		this.options = { ...this.options, ...options };

		this.checkElement();
		this.initInterface();
	}

	private checkElement(): void {
		if (this.element.nodeName !== "INPUT") {
			const error = new InvalidElementError(this.element.nodeName);
			this.emit("error", error);

			throw error;
		}

		if (this.element.type !== "file") {
			const error = new InvalidInputTypeError(this.element.type);
			this.emit("error", error);

			throw error;
		}

		if (!("form" in this.element) || !this.element.form) {
			const error = new NotInFormError();
			this.emit("error", error);

			throw error;
		}
	}

	private initInterface(): void {
		if (!this.element.id) {
			this.element.id = "dropzone";
		}

		const dropzone = this.getDropzone();

		this.element.addEventListener("change", () => {
			this.refreshDropzone(this.element.files!);
		});
		dropzone.addEventListener("click", (e) => {
			const target = e.target as HTMLElement | null;

			if (target && ["svg", "button", "path"].includes(target.nodeName.toLowerCase())) {
				return;
			}
			this.element.click();
		});
		dropzone.addEventListener("dragenter", (e) => {
			e.preventDefault();
			dropzone.classList.add("border__label-hover");
			this.emit("dragEnter");
		});
		dropzone.addEventListener("dragleave", (e) => {
			e.preventDefault();
			dropzone.classList.remove("border__label-hover");
			this.emit("dragLeave");
		});
		dropzone.addEventListener("dragover", (e) => {
			e.preventDefault();
			this.emit("dragOver");
		});
		dropzone.addEventListener("drop", (e) => {
			const { files } = e.dataTransfer!;
			e.preventDefault();

			this.refreshDropzone(files);
			for (let i = 0; i < files.length; i++) {
				if (!files.item(i)) {
					return;
				}
				this.addFile(files.item(i)!);
			}
			this.emit("drop", files);

			if (files.length === 1) {
				this.emit("addFile", files.item(0));
			} else {
				this.emit("addFiles", files);
			}
		});

		this.onMouseHover();
		this.onMouseLeave();
	}

	private addFile(file: File): void {
		const files = Array.from(this.element.files!);
		files.push(file);
		this.element.files = this.createFileList(files);
	}

	private createFileList(files: File[]): FileList {
		const dataTransfer = new DataTransfer();
		files.forEach((file) => {
			dataTransfer.items.add(file);
		});

		return dataTransfer.files;
	}

	private getDropzone(): HTMLDivElement {
		let dropzone: HTMLDivElement | null = this.element.form!.querySelector(".dz__dropzone");

		if (!dropzone) {
			dropzone = document.createElement("div");
			dropzone.innerHTML = this.options.containerTemplate!(undefined, this.options.label);
			this.element.insertAdjacentElement("beforebegin", dropzone.firstElementChild!);
		}

		return document.querySelector(".dz__dropzone") as HTMLDivElement;
	}

	private onMouseHover(): void {
		const label = this.getDropzone();
		label.addEventListener("mouseover", () => {
			label.classList.add("border__label-hover");
			this.emit("hover");
		});
	}

	private onMouseLeave(): void {
		const label = this.getDropzone();
		label.addEventListener("mouseleave", () => {
			label.classList.remove("border__label-hover");
			this.emit("leave");
		});
	}

	private refreshDropzone(files: FileList): void {
		document.querySelector(".dz__dropzone")!.outerHTML = this.options.containerTemplate!(files, this.options.label);
		this.initButtonsListeners();
		this.initInterface();
		this.emit("refreshDropzone");
	}

	private initButtonsListeners(): void {
		const buttons = Array.from<HTMLButtonElement>(document.querySelectorAll(".dz__delete-file"));
		for (const button of buttons) {
			button.addEventListener("click", () => {
				const files = this.removeFile(button.name);
				this.element.files = files;
				this.refreshDropzone(files);
			});
		}
	}

	private removeFile(fileName: string): FileList {
		const { files } = this.element;
		const filesArray = Array.from(files!);
		this.emit("removeFile", filesArray.filter((file) => removeExt(file.name) === fileName)[0]);

		return this.createFileList(filesArray.filter((file) => removeExt(file.name) !== fileName));
	}
}