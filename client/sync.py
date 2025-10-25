import requests
import asyncio

async def req():
    response = requests.get("https://httpbin.org/get")
    print(response.json())

asyncio.run(req())
