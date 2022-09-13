import { Callbacks, EventCallback, Events } from "./types";

export class Emitter {
	private _callbacks: Record<string, Callbacks[]> = {};

	/**
	 * Register an event.
	 * @param {Events} event
	 * @param {EventCallback} fn
	 */
	public on<T extends Events>(event: T, fn: EventCallback<T>): this {
		if (!this._callbacks[event]) {
			this._callbacks[event] = [];
		}

		this._callbacks[event].push(fn);
		return this;
	}

	/**
	 * Call a registered event
	 * @param {Events} event
	 * @param {unknown[]} args
	 */
	public emit(event: Events, ...args: unknown[]): this {
		const callbacks = this._callbacks[event];

		if (callbacks) {
			for (const callback of callbacks) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				callback.apply(this, args);
			}
		}

		return this;
	}
}
