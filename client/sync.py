import time
import requests
import asyncio
import os
import light
from storage import deleteUnusedSamples, fileExists, saveSample
from collections import namedtuple

ApiSample = namedtuple("ApiSample", ["id", "name"])
ApiSlot = namedtuple("ApiSlot", ["sampleId", "color", "position", "layerId"])
ApiLayer = namedtuple("ApiLayer", ["id", "color"])


def syncSamples(samples: list[ApiSample]):
    for sample in samples:
        if fileExists(sample.id):
            continue
        data = getSampleFile(sample.id)
        saveSample(sample.id, data)
    usedSampleIds = [s.id for s in samples]
    deleteUnusedSamples(usedSampleIds)


def performSync():
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    sync = url + "/api/sync"
    response = requests.get(sync)
    json = response.json()
    slotsDict = json["slots"]
    slots: list[ApiSlot] = []
    for s in slotsDict:
        slot = ApiSlot(s["sampleId"], s["color"], s["position"], s["layerId"])
        slots.append(slot)

    samplesDict = json["samples"]
    samples: list[ApiSample] = []
    for s in samplesDict:
        sample = ApiSample(s["id"], s["name"])
        samples.append(sample)

    syncSamples(samples)

    layersDict = json["layers"]
    layers: list[ApiLayer] = []
    for l in layersDict:
        layer = ApiLayer(l["id"], l["color"])
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
            light.setStatus(light.Status.SYNCING)
            slots, samples, layers = performSync()
            synced = True
        except Exception:
            light.setStatus(light.Status.NO_INTERNET)
            time.sleep(5)

    light.setStatus(light.Status.READY)
    print("Sync complete.")
    return slots, samples, layers


def getSampleFile(id: str) -> bytes:
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    print(f"Downloading sample {id}")
    sampleUrl = url + "/api/sample/" + id
    response = requests.get(sampleUrl)
    return response.content


# asyncio.run(sync())
