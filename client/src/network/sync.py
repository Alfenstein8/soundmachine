import time
import os
import requests
from hardware import light
from core.storage import delete_unused_samples, file_exists, save_sample
from network.types import ApiLayer, ApiSample, ApiSlot


def sync_samples(samples: list[ApiSample]):
    for sample in samples:
        if file_exists(sample.id):
            continue
        data = get_sample_file(sample.id)
        save_sample(sample.id, data)
    used_sample_ids = [s.id for s in samples]
    delete_unused_samples(used_sample_ids)


def perform_sync():
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    sync_url = url + "/api/sync"
    response = requests.get(sync_url, timeout=10)
    json = response.json()
    slots_dict = json["slots"]
    slots: list[ApiSlot] = []
    for s in slots_dict:
        slot = ApiSlot(s["sampleId"], s["color"], s["position"], s["layerId"])
        slots.append(slot)

    samples_dict = json["samples"]
    samples: list[ApiSample] = []
    for s in samples_dict:
        sample = ApiSample(s["id"], s["name"], s["favorite"])
        samples.append(sample)

    sync_samples(samples)

    layers_dict = json["layers"]
    layers: list[ApiLayer] = []
    for lay in layers_dict:
        layer = ApiLayer(lay["id"], lay["color"])
        layers.append(layer)
    return slots, samples, layers


def sync():
    print("Starting sync...")
    synced = False
    slots: list[ApiSlot] = []
    samples: list[ApiSample] = []
    layers: list[ApiLayer] = []
    while not synced:
        try:
            light.set_status(light.Status.SYNCING)
            slots, samples, layers = perform_sync()
            synced = True
        except Exception:
            light.set_status(light.Status.NO_INTERNET)
            time.sleep(5)

    light.set_status(light.Status.READY)
    print("Sync complete.")
    return slots, samples, layers


def get_sample_file(sample_id: str) -> bytes:
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    print(f"Downloading sample {sample_id}")
    sample_url = url + "/api/samples/" + sample_id
    response = requests.get(sample_url, timeout=10)
    return response.content


# asyncio.run(sync())
