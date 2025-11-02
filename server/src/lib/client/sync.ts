import { tags, samples, slots } from "$stores/globals"
import * as api from "$lib/client/api"

export const syncClient = async () => {
  await Promise.all([syncTags(), syncSamples(), syncSlots()]);
}

export const syncTags = async () => {
  const newTags = await api.getAllTags();
  tags.set(newTags)
  console.log("Synced Tags");
}

export const syncSamples = async () => {
  const newSamples = await api.getAllSamples();
  samples.set(newSamples)
  console.log("Synced Samples");
}

export const syncSlots = async () => {
  const newSlots = await api.getAllSlots();
  slots.set(newSlots)
  console.log("Synced Slots");

}
