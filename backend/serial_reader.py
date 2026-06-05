import threading
import time
from collections import deque
from datetime import datetime

import serial

from config import Config


class FloodSerialReader:
    def __init__(self):
        self.history = deque(maxlen=Config.MAX_HISTORY)
        self.latest = None
        self.is_running = False
        self.is_connected = False
        self.last_error = None
        self.last_raw_line = None
        self._thread = None

    def start(self):
        if self.is_running:
            return

        self.is_running = True
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self.is_running = False
        self.is_connected = False

    def get_latest(self):
        return self.latest or self._build_payload(0, "NO_READING")

    def get_history(self):
        return list(self.history)

    def get_health(self):
        return {
            "running": self.is_running,
            "connected": self.is_connected,
            "port": Config.SERIAL_PORT,
            "baudrate": Config.SERIAL_BAUDRATE,
            "last_error": self.last_error,
            "last_raw_line": self.last_raw_line,
        }

    def _read_loop(self):
        while self.is_running:
            try:
                with serial.Serial(
                    Config.SERIAL_PORT,
                    Config.SERIAL_BAUDRATE,
                    timeout=Config.SERIAL_TIMEOUT,
                ) as connection:
                    self.is_connected = True
                    self.last_error = None
                    while self.is_running:
                        raw_line = connection.readline().decode("utf-8", errors="ignore").strip()
                        if raw_line:
                            self.last_raw_line = raw_line
                        payload = self._parse_line(raw_line)
                        if payload:
                            self._store_payload(payload)
            except serial.SerialException as exc:
                self.is_connected = False
                self.last_error = str(exc)
                self._store_payload(
                    {
                        "distance_cm": 0,
                        "status": "NO_READING",
                        "level_percent": 0,
                        "message": f"Serial error: {exc}",
                    }
                )
                time.sleep(2)
            finally:
                self.is_connected = False

    def _parse_line(self, raw_line):
        if not raw_line or raw_line == "distance_cm,status":
            return None

        parts = raw_line.split(",")
        if len(parts) < 2:
            return None

        try:
            distance_cm = float(parts[0])
        except ValueError:
            return None

        status = parts[1].strip().upper()
        return self._build_payload(distance_cm, status)

    def _build_payload(self, distance_cm, status):
        level_percent = self._distance_to_level(distance_cm)

        messages = {
            "SAFE": "Mức nước an toàn",
            "WARNING": "Mức nước đang tăng",
            "DANGER": "Nguy cơ ngập cao",
            "NO_READING": "Không đọc được cảm biến",
        }

        return {
            "distance_cm": round(distance_cm, 1),
            "status": status,
            "level_percent": level_percent,
            "message": messages.get(status, "Không rõ trạng thái"),
        }

    def _distance_to_level(self, distance_cm):
        min_distance = 4.0
        max_distance = 35.0
        clamped = max(min_distance, min(max_distance, distance_cm))
        percent = (max_distance - clamped) / (max_distance - min_distance) * 100
        return round(percent, 0)

    def _store_payload(self, payload):
        payload["timestamp"] = datetime.now().strftime("%H:%M:%S")
        self.latest = payload
        self.history.append(payload)
