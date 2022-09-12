export class NotInFormError extends Error {
	constructor() {
		super();
		this.name = "NotInFormError";
		this.message = "Element has to be a child of a form element.";
	}
}
