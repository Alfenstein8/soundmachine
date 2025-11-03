import type { tagAttachmentSelect, TagSelect } from '$schema';
import { tagAttachments, tags } from '$stores/globals';
import { get } from 'svelte/store';

export const isFirefox = (): boolean => navigator.userAgent.search('Firefox') > -1;

export const sampleTags = (sampleId: string): TagSelect[] => {
  const ta: tagAttachmentSelect[] = get(tagAttachments).filter((t) => t.sampleId === sampleId);

  return get(tags).filter((tag) => ta.some((t) => t.tagName === tag.name));
};
