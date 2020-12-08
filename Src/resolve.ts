import * as path from 'path';

export function fromRoot(...paths: string[]): string {
	return path.join(__dirname, '..', ...paths);
}

export function fromSrc(...paths: string[]): string {
	return fromRoot('Src', ...paths);
}
export function fromClient(...paths: string[]): string {
	return fromSrc('client', ...paths);
}
