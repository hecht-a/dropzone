export class AlreadyExistsError extends Error {
	constructor(target: string) {
		super();
		this.name = "AlreadyExistsError";
		this.message = `Dropzone element already exists for the element with id "${target}."`;
	}
}
