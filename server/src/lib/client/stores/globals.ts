import type { SampleSelect, SlotSelect } from '$schema';
import { writable, type Writable } from 'svelte/store';


export const slots: Writable<SlotSelect[]> = writable([]);
export const samples: Writable<SampleSelect[]> = writable([]);

export const placeSample: Writable<SampleSelect | null> = writable(null);

export const selectedSlot: Writable<SlotSelect | null> = writable(null);
export const selectedSample: Writable<SampleSelect | null> = writable(null);
