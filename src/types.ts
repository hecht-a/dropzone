type Options = {
	id: string,
	label: string,
	hoverLabel: string,
	containerTemplate: (files?: FileList, label?: string, id?: string) => string,
	fileTemplate: (fileName: string) => string,
	onHover: () => void,
	onLeave: () => void,
	onAddFile: (file: File) => void,
	onAddFiles: (files: FileList) => void,
	onError: (error: Error) => void,
	onDrop: (files: FileList) => void,
	onDragEnter: () => void,
	onDragLeave: () => void,
	onDragOver: () => void,
	onRefreshDropzone: () => void,
	onRemoveFile: (file: File) => void
	onClearDropzone: (files: FileList) => void
};

export type DefaultOptions = Partial<Options>;

export type OnEvents = Extract<keyof Options, `on${string}`>;

export type Events = OnEvents extends `on${infer T}` ? Uncapitalize<T> : OnEvents;

export type Callbacks = Options[keyof Options];

export type EventCallback<T extends Events> = Options[`on${Capitalize<T>}`];
