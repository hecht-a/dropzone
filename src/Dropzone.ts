import { Emitter } from "./Emitter";
import { NotInFormError, InvalidElementError, InvalidInputTypeError } from "./Exceptions";
import { options } from "./options";
import { DefaultOptions } from "./types";

export class Dropzone extends Emitter {
	private readonly options: typeof options = options;

	constructor(private element: HTMLInputElement, options: DefaultOptions) {
		super();
		this.checkElement();
		this.initInterface();

		this.options = { ...this.options, ...options };
	}

	private checkElement(): void {
		if (this.element.nodeName !== "INPUT") {
			this.emit("error");
			throw new InvalidElementError(this.element.nodeName);
		}

		if (this.element.type !== "file") {
			throw new InvalidInputTypeError(this.element.type);
		}

		if (!("form" in this.element) || !this.element.form) {
			throw new NotInFormError();
		}
	}

	private initInterface(): void {
		if (!this.element.id) {
			this.element.id = "dropzone";
		}

		const label = this.getLabel();

		label.addEventListener("dragenter", (e) => {
			e.preventDefault();
			label.classList.add("border__label-white");
			this.emit("dragEnter");
		});
		label.addEventListener("dragleave", (e) => {
			e.preventDefault();
			label.classList.remove("border__label-white");
			this.emit("dragLeave");
		});
		label.addEventListener("dragover", (e) => {
			e.preventDefault();
			this.emit("dragOver");
		});
		label.addEventListener("drop", (e) => {
			const { files } = e.dataTransfer!;
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

			e.preventDefault();
		});

		this.onMouseHover();
		this.onMouseLeave();
	}

	private addFile(file: File): void {
		const files = Array.from(this.element.files!);
		files.push(file);
		this.element.files = this.createFileList(files);

		const label = this.getLabel();
		label.innerHTML = "<div><div>test</div></div>";
	}

	private createFileList(files: File[]): FileList {
		const dataTransfer = new DataTransfer();
		files.forEach((file) => {
			dataTransfer.items.add(file);
		});

		return dataTransfer.files;
	}

	private getLabel(): HTMLLabelElement {
		let label: HTMLLabelElement | null = this.element.form!.querySelector(`label[for='${this.element.id}']`);

		if (!label) {
			label = document.createElement("label");
			label.htmlFor = this.element.id;
			label.classList.add("dropzone__label");
			label.textContent = this.options.label!;
			this.element.insertAdjacentElement("beforebegin", label);
		}

		return label;
	}

	private onMouseHover(): void {
		const label = this.getLabel();
		label.addEventListener("mouseover", () => {
			label.classList.add("border__label-white");
			this.emit("hover");
		});
	}

	private onMouseLeave(): void {
		const label = this.getLabel();
		label.addEventListener("mouseleave", () => {
			label.classList.remove("border__label-white");
			this.emit("leave");
		});
	}
}
