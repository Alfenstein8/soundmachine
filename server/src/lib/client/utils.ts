import { colors } from '$lib/colors';
import type { tagAttachmentSelect, TagSelect } from '$schema';
import { slots, tagAttachments, tags } from '$stores/globals';
import { get } from 'svelte/store';

export const isFirefox = (): boolean => navigator.userAgent.search('Firefox') > -1;

export const sampleTags = (sampleId: string): TagSelect[] => {
  const ta: tagAttachmentSelect[] = get(tagAttachments).filter((t) => t.sampleId === sampleId);

  return get(tags).filter((tag) => ta.some((t) => t.tagName === tag.name));
};

export const getTagHex = (tagName: string | undefined | null) =>
  colors.getHex(get(tags).find((t) => t.name === tagName)?.color ?? 3);

export const isSampleUsed = (sampleId: string)=> get(slots).some((slot) => slot.sampleId === sampleId);
