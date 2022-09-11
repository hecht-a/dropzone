type Options = {
	label: string,
	hoverLabel: string,
	onHover: () => void,
	onLeave: () => void,
	onAddFile: (file: File) => void,
	onAddFiles: (files: FileList) => void,
	onError: (error: Error) => void,
	onDrop: (files: FileList) => void,
	onDragEnter: () => void
	onDragLeave: () => void
	onDragOver: () => void
};

export type DefaultOptions = Partial<Options>;

export type OnEvents = Extract<keyof Options, `on${string}`>;

export type Events = OnEvents extends `on${infer T}` ? Uncapitalize<T> : OnEvents;

export type Callbacks = Options[keyof Options];

export type EventCallback<T extends Events> = Options[`on${Capitalize<T>}`];
