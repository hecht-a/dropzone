import { Emitter } from "./Emitter";
import {
	// eslint-disable-next-line max-len
	NotInFormError,
	InvalidElementError,
	InvalidInputTypeError,
	AlreadyExistsError,
	TooManyFilesError,
	TooMuchFilesError,
} from "./Exceptions";
import { options } from "./options";
import { DefaultOptions } from "./types";
import { removeExt } from "./utils";
import "./style.scss";
import { FilenameAlreadyExistsError } from "./Exceptions/FilenameAlreadyExistsError";

export class Dropzone extends Emitter {
	private readonly options: typeof options = options;

	private _files: FileList | undefined;

	/**
   * Dropzone constructor.
   * @param {HTMLInputElement} element
   * @param {DefaultOptions} options
   */
	constructor(private element: HTMLInputElement, options: DefaultOptions) {
		super();
		this.options = { ...this.options, ...options };

		this.checkElement();
		this.initInterface();
	}

	/**
   * Check if element given in constructor is correct.
   * @private
   */
	private checkElement(): void {
		if (document.querySelector(`[data-for='${this.element.id}']`)) {
			const error = new AlreadyExistsError(this.element.id);
			this.emit("error", error);

			throw error;
		}

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

	/**
   * Init the interface.
   * Generate html and event listeners.
   * @private
   */
	private initInterface(): void {
		if (!this.element.id) {
			this.element.id = "dropzone";
		}

		const dropzone = this.getDropzone();

		this.element.addEventListener("change", (e) => {
			const { files } = e.target! as EventTarget & { files: FileList };
			this.refreshDropzone(this.element.files!);

			if (files.length === 1) {
				this.emit("addFile", files.item(0));
			} else {
				this.emit("addFiles", files);
			}
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
			dropzone.classList.add("border__dropzone-hover");
			this.emit("dragEnter");
		});
		dropzone.addEventListener("dragleave", (e) => {
			e.preventDefault();
			dropzone.classList.remove("border__dropzone-hover");
			this.emit("dragLeave");
		});
		dropzone.addEventListener("dragover", (e) => {
			e.preventDefault();
			this.emit("dragOver");
		});
		dropzone.addEventListener("drop", (e) => {
			const { files } = e.dataTransfer!;
			e.preventDefault();

			this.validateLength(files);

			if (files.length === 1) {
				this.addFile(files.item(0)!);
			} else {
				this.addFiles(files);
			}

			this.refreshDropzone(this._files!);
			this.emit("drop", files);
		});

		this.onMouseHover();
		this.onMouseLeave();
	}

	/**
   * Add a file to the input.
   * @param {File} file
   * @private
   */
	private addFile(file: File): void {
		const files = Array.from(this.element.files!);

		if (files.filter((elementFile) => removeExt(elementFile.name) === removeExt(file.name)).length !== 0) {
			const error = new FilenameAlreadyExistsError(file.name);
			this.emit("error", error);

			throw error;
		}

		const { max } = this.options;
		const length = (this._files ?? files).length + 1;

		if (max && length > max) {
			const error = new TooManyFilesError(max, length);
			this.emit("error", error);
			throw error;
		}

		files.push(file);
		const fileList = this.createFileList(files);

		this._files = fileList;
		this.element.files = fileList;
		this.emit("addFile", file);
	}

	/**
   * Add files to the input.
   * @param {FileList} files
   * @private
   */
	private addFiles(files: FileList): void {
		for (let i = 0; i < files.length; i++) {
			if (!files.item(i)) {
				return;
			}

			this.addFile(files.item(i)!);
		}
		this.emit("addFiles", files);
	}

	private validateLength(files: FileList | File[]): void {
		const { length } = files;
		const { min, max } = this.options;
		if (min !== undefined && min !== null) {
			if (length < min || length === 0) {
				const error = new TooMuchFilesError(min, length);
				this.emit("error", error);
				throw error;
			}
		}

		if (max !== undefined && max !== null) {
			if (length > max) {
				const error = new TooManyFilesError(max, length);
				this.emit("error", error);
				throw error;
			}
		}
	}

	/**
   * Create FileList instance from array of File.
   * @param {File[]} files
   * @return FileList
   * @private
   */
	private createFileList(files: File[]): FileList {
		const reducer = (dataTransfer: DataTransfer, file: File): DataTransfer => {
			dataTransfer.items.add(file);
			return dataTransfer;
		};

		return files.reduce(reducer, new DataTransfer()).files;
	}

	/**
   * Get or generate the html of the dropzone.
   * @return HTMLDivElement
   * @private
   */
	private getDropzone(): HTMLDivElement {
		let dropzone: HTMLDivElement | null = this.element.form!.querySelector(`[data-for='${this.element.id}']`);

		if (!dropzone) {
			dropzone = document.createElement("div");
			dropzone.innerHTML = this.options.containerTemplate!(this.options.max!, undefined, this.options.label);
			dropzone.firstElementChild!.setAttribute("data-for", this.element.id);
			this.element.insertAdjacentElement("beforebegin", dropzone.firstElementChild!);
		}

		return document.querySelector(`[data-for='${this.element.id}']`) as HTMLDivElement;
	}

	/**
   * Method called when mouse hover the dropzone.
   * @private
   */
	private onMouseHover(): void {
		const label = this.getDropzone();
		label.addEventListener("mouseover", () => {
			label.classList.add("border__dropzone-hover");
			this.emit("hover");
		});
	}

	/**
   * Method called when mouse leave the dropzone.
   * @private
   */
	private onMouseLeave(): void {
		const label = this.getDropzone();
		label.addEventListener("mouseleave", () => {
			label.classList.remove("border__dropzone-hover");
			this.emit("leave");
		});
	}

	/**
   * Refresh the dropzone.
   * @param {FileList} files
   * @private
   */
	private refreshDropzone(files: FileList): void {
		const dropzone = this.getDropzone();
		dropzone.outerHTML = this
			.options
			.containerTemplate!(this.options.max!, files, this.options.label, this.element.id);

		this.initButtonsListeners();
		this.initInterface();
		this.emit("refreshDropzone");
	}

	/**
   * Init button listeners used to delete an uploaded file.
   * @private
   */
	private initButtonsListeners(): void {
		const buttons = Array
			.from<HTMLButtonElement>(
			document.querySelectorAll(`[data-for='${this.element.id}'] .dz__delete-file`),
		);
		for (const button of buttons) {
			button.addEventListener("click", () => {
				const files = this.removeFile(button.name);
				this.element.files = files;
				this.refreshDropzone(files);
			});
		}
	}

	/**
   * Remove file from the input.
   * @param {string} fileName
   * @return FileList
   * @private
   */
	private removeFile(fileName: string): FileList {
		const { files } = this.element;
		const filesArray = Array.from(files!);
		this.emit("removeFile", filesArray.filter((file) => removeExt(file.name) === fileName)[0]);

		const newFileList = this.createFileList(filesArray.filter((file) => removeExt(file.name) !== fileName));
		this._files = newFileList;

		return newFileList;
	}

	/**
   * Remove all files from the input
   */
	public clearFiles(): void {
		const { files } = this.element;
		this.element.files = new DataTransfer().files;
		this.refreshDropzone(this.element.files);
		this.emit("clearDropzone", files);
	}

	public setMin(min: number): void {
		this.options.min = min;
	}

	public setMax(max: number): void {
		this.options.max = max;
	}
}
