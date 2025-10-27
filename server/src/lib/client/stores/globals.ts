import type { SampleSelect, SlotSelect } from '$schema';
import { writable, type Writable } from 'svelte/store';


export const slots: Writable<SlotSelect[]> = writable([]);
export const samples: Writable<SampleSelect[]> = writable([]);

export const placeSample: Writable<SampleSelect | null> = writable(null);

export const editPadModal: Writable<SlotSelect | null> = writable(null);
export const showUploadModal = writable(false);
export const editSampleModal: Writable<SampleSelect | null> = writable(null);
