import type { SampleSelect, SlotSelect, tagAttachmentSelect, TagSelect } from '$schema';
import { writable, type Writable } from 'svelte/store';

export const slots: Writable<SlotSelect[]> = writable([]);
export const samples: Writable<SampleSelect[]> = writable([]);
export const tags: Writable<TagSelect[]> = writable([]);
export const tagAttachments: Writable<tagAttachmentSelect[]> = writable([]);

export const selectedSlot: Writable<SlotSelect | null> = writable(null);
export const selectedSample: Writable<SampleSelect | null> = writable(null);

export const searchTerm = writable('');

export const libraryModal: Writable<HTMLDialogElement> = writable();
export const uploadModal: Writable<HTMLDialogElement> = writable();
export const padModal: Writable<HTMLDialogElement> = writable();
export const newTagModal: Writable<HTMLDialogElement> = writable();
