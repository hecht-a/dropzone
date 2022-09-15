export class TooManyFilesError extends Error {
	constructor(max: number, length: number) {
		super();
		this.name = "TooManyFilesError";
		this.message = `You sent too many files. Maximum is ${max}, you sent ${length}.`;
	}
}
