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
