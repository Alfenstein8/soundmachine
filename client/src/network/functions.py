import os
import requests


def remove_slot(layer_id: int, slot_id: int):
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    delete_url = url + f"/api/layers/{str(layer_id)}/{str(slot_id)}"
    response = requests.delete(delete_url, timeout=10)
    if response.status_code != 204:
        print(
            f"Failed to delete slot with id {str(slot_id)}: {response.status_code} - {response.text}"
        )


def set_favorite(sample_id: str, favorite: bool):
    url = os.getenv("SERVER_URL")
    if url is None:
        print("SERVER_URL not found")
        url = ""
    patch_url = url + "/api/samples/" + str(sample_id)
    response = requests.patch(
        patch_url,
        json={"favorite": favorite},
        timeout=10,
    )

    if response.status_code != 204:
        print(
            f"Failed to update sample with id {str(sample_id)}: {response.status_code} - {response.text}"
        )
