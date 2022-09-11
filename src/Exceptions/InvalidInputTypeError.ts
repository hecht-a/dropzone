export class InvalidInputTypeError extends Error {
	constructor(inputType: string) {
		super();
		this.name = "InvalidInputTypeError";
		this.message = `${inputType} type does not correspond to file type`;
	}
}
