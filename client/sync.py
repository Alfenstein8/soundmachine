import requests
import asyncio
import os
from storage import saveSample
from collections import namedtuple

ApiSample = namedtuple("ApiSample", ["id", "name"])
ApiSlot = namedtuple("ApiSlot", ["id", "sampleId"])

def syncSamples(samples: list[ApiSample]):
    for sample in samples:
        print(sample)
        data = getSampleFile(sample.id)
        saveSample(sample.id, data)


def sync():
    url = os.getenv("SERVER_URL")
    if url is None:
        url = "http://localhost:5173"
    sync = url + "/api/sync"
    response = requests.get(sync)
    json = response.json()
    slotsDict = json["slots"]
    slots: list[ApiSlot] = []
    for s in slotsDict:
        slot = ApiSlot(s["id"], s["sampleId"])
        slots.append(slot)

    samplesDict = json["samples"]
    samples: list[ApiSample] = []
    for s in samplesDict:
        sample = ApiSample(s["id"], s["name"])
        samples.append(sample)
    syncSamples(samples);
    return slots, samples


def getSampleFile(id: str) -> bytes:
    url = os.getenv("SERVER_URL")
    if url is None:
        url = "http://localhost:5173"
    sampleUrl = url + "/api/sample/" + id
    response = requests.get(sampleUrl)
    return response.content

# asyncio.run(sync())
