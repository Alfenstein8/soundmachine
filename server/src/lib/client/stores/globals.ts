import { availableColorCodes } from '$lib/colors';
import { pickRandom } from '$lib/utils';
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
export const editTagModal: Writable<HTMLDialogElement> = writable();
export const colorModal: Writable<HTMLDialogElement> = writable();

export const selectedColor: Writable<number> = writable(pickRandom(availableColorCodes));
