import { DefaultOptions } from "./types";
import { removeExt } from "./utils";

export const options: DefaultOptions = {
	hoverLabel: "hover",
	label: "Upload files",
	containerTemplate(files?: FileList, label?: string, id = "dropzone") {
		return `<div class="dz__dropzone" data-for="${id}">
        ${
	files && files.length > 0
		? `<div class="dz__files">
            ${Array.from(files).map((file) => this.fileTemplate!(file.name)).join("")}
           </div>`
		: `<div class="dz__label">
            <p>${label ?? this.label}</p>
           </div>`}
    </div>`;
	},
	fileTemplate: (fileName: string) => `
    <div class="file">
        <button class="dz__delete-file" type="button" name="${removeExt(fileName)}">
        <svg 
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        >
            <path 
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
        </svg>
        </button>
        <p>${fileName}</p>
    </div>`,
};
