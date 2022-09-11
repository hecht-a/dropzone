import { Callbacks, EventCallback, Events } from "./types";

export class Emitter {
	private _callbacks: Record<string, Callbacks[]> = {};

	public on<T extends Events>(event: T, fn: EventCallback<T>): this {
		if (!this._callbacks[event]) {
			this._callbacks[event] = [];
		}

		this._callbacks[event].push(fn);
		return this;
	}

	public emit(event: Events, ...args: unknown[]): this {
		const callbacks = this._callbacks[event];

		if (callbacks) {
			for (const callback of callbacks) {
				// @ts-ignore
				callback.apply(this, args);
			}
		}

		return this;
	}
}
