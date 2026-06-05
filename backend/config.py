import os


class Config:
    SERIAL_PORT = os.getenv("SERIAL_PORT", "COM3")
    SERIAL_BAUDRATE = int(os.getenv("SERIAL_BAUDRATE", "9600"))
    SERIAL_TIMEOUT = float(os.getenv("SERIAL_TIMEOUT", "1"))
    MAX_HISTORY = int(os.getenv("MAX_HISTORY", "80"))
    HOST = os.getenv("FLASK_HOST", "127.0.0.1")
    PORT = int(os.getenv("FLASK_PORT", "5001"))
    DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"
