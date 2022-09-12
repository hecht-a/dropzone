export const removeExt = (fileName: string): string => {
	const name = fileName.split(".");
	name.pop();
	return name.join(".");
};
