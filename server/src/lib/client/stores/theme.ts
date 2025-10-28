import { writable, type Writable } from 'svelte/store';

export const themes = ['sunset', 'pastel', 'forest', 'wireframe'] as const;
export type Theme = (typeof themes)[number];

export const theme: Writable<Theme> = writable('forest');
