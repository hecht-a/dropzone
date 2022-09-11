export class InvalidElementError extends Error {
	constructor(elementName: string) {
		super();
		this.name = "InvalidElementError";
		this.message = `${elementName} element does not correspond to INPUT element.`;
	}
}
