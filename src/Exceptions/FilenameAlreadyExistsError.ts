export class FilenameAlreadyExistsError extends Error {
	constructor(filename: string) {
		super();
		this.name = "FilenameAlreadyExistsError";
		this.message = `The file with the name ${filename} already exists in the dropzone`;
	}
}
