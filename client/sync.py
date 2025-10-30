import time
import requests
import asyncio
import os
import light
from storage import saveSample
from collections import namedtuple

ApiSample = namedtuple("ApiSample", ["id", "name"])
ApiSlot = namedtuple("ApiSlot", ["id", "sampleId", "color"])


def syncSamples(samples: list[ApiSample]):
    for sample in samples:
        data = getSampleFile(sample.id)
        saveSample(sample.id, data)


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
        slot = ApiSlot(s["id"], s["sampleId"], s["color"])
        slots.append(slot)

    samplesDict = json["samples"]
    samples: list[ApiSample] = []
    for s in samplesDict:
        sample = ApiSample(s["id"], s["name"])
        samples.append(sample)
    syncSamples(samples)
    return slots, samples


def sync():
    synced = False
    slots: list[ApiSlot] = []
    samples: list[ApiSample] = []
    print("asf")
    while not synced:
        try:
            light.setStatus(light.Status.SYNCING)
            slots, samples = performSync()
            synced = True
        except Exception:
            light.setStatus(light.Status.NO_INTERNET)
            time.sleep(5)

    light.setStatus(light.Status.READY)
    return slots, samples


def getSampleFile(id: str) -> bytes:
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    sampleUrl = url + "/api/sample/" + id
    response = requests.get(sampleUrl)
    return response.content


# asyncio.run(sync())
