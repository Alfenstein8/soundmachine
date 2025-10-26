import  os
SAMPLE_DIR = "./samples/"

def saveSample(id: str, data: bytes):
    """
    Saves the provided binary data (assumed to be a complete WAV file)
    to the samples directory.

    Args:
        id (str): The unique identifier for the file (used as the filename).
        data (bytes): The complete binary content of the audio file
                      (including the WAV header).
    """

    # 1. Ensure the directory exists
    if not os.path.exists(SAMPLE_DIR):
        try:
            os.makedirs(SAMPLE_DIR)
            print(f"Created sample directory: {SAMPLE_DIR}")
        except OSError as e:
            print(f"Error creating directory {SAMPLE_DIR}: {e}")
            return # Stop execution if directory creation fails

    wavPath = os.path.join(SAMPLE_DIR, id + ".wav")

    # 2. Use 'with open' for safe file handling (ensures the file is closed)
    try:
        with open(wavPath, "wb") as f:
            f.write(data)
        print(f"Successfully saved sample: {wavPath}")

    except IOError as e:
        print(f"Error writing file {wavPath}: {e}")
