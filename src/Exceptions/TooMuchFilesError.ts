export class TooMuchFilesError extends Error {
	constructor(min: number, length: number) {
		super();
		this.name = "TooMuchFilesError";
		this.message = `You sent too much files. Minimum is ${min}, you sent ${length}.`;
	}
}
