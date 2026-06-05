
/// ================================
// FLOOD WARNING SYSTEM - ARDUINO
// Hardware: HC-SR04 + 1 LED + LCD 1602
// ================================

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// -------- HC-SR04 PINS --------
const byte TRIG_PIN = 9;
const byte ECHO_PIN = 10;

// -------- LED PIN --------
const byte LED_PIN = 6;

// -------- LCD 1602 I2C --------
// Common I2C address is 0x27. If the LCD does not show text, try 0x3F.
LiquidCrystal_I2C lcd(0x27, 16, 2);

// -------- WATER LEVEL THRESHOLDS --------
// HC-SR04 measures distance from the sensor to the water surface.
// Lower distance means higher water level.
const float WARNING_DISTANCE_CM = 20.0;
const float DANGER_DISTANCE_CM = 10.0;

const unsigned long READ_INTERVAL_MS = 1000;
const unsigned long ECHO_TIMEOUT_US = 30000UL;
const unsigned long WARNING_BLINK_MS = 180;
const unsigned long NO_READING_BLINK_MS = 700;

enum FloodStatus {
  SAFE,
  WARNING,
  DANGER,
  NO_READING
};

float readDistanceCm();
FloodStatus getStatusLevel(float distanceCm);
void updateLed(FloodStatus status);
void blinkLed(unsigned long intervalMs);
void printReading(float distanceCm, FloodStatus status);
void updateLcd(float distanceCm, FloodStatus status);
const char* statusToText(FloodStatus status);
const char* statusToLcdText(FloodStatus status);

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(TRIG_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Flood Warning");
  lcd.setCursor(0, 1);
  lcd.print("Starting...");

  Serial.println("Flood Warning System Started");
  Serial.println("distance_cm,status");
}

void loop() {
  static unsigned long lastReadAt = 0;
  static FloodStatus currentStatus = NO_READING;

  updateLed(currentStatus);

  if (millis() - lastReadAt < READ_INTERVAL_MS) {
    return;
  }

  lastReadAt = millis();
  float distanceCm = readDistanceCm();
  currentStatus = getStatusLevel(distanceCm);

  printReading(distanceCm, currentStatus);
  updateLcd(distanceCm, currentStatus);
}

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  if (duration == 0) {
    return -1.0;
  }

  return duration * 0.0343 / 2.0;
}

FloodStatus getStatusLevel(float distanceCm) {
  if (distanceCm < 0) {
    return NO_READING;
  }

  if (distanceCm <= DANGER_DISTANCE_CM) {
    return DANGER;
  }

  if (distanceCm <= WARNING_DISTANCE_CM) {
    return WARNING;
  }

  return SAFE;
}

void updateLed(FloodStatus status) {
  if (status == DANGER) {
    digitalWrite(LED_PIN, HIGH);
    return;
  }

  if (status == WARNING) {
    blinkLed(WARNING_BLINK_MS);
    return;
  }

  if (status == NO_READING) {
    blinkLed(NO_READING_BLINK_MS);
    return;
  }

  digitalWrite(LED_PIN, LOW);
}

void blinkLed(unsigned long intervalMs) {
  static unsigned long lastToggleAt = 0;
  static bool ledState = false;

  if (millis() - lastToggleAt < intervalMs) {
    return;
  }

  lastToggleAt = millis();
  ledState = !ledState;
  digitalWrite(LED_PIN, ledState ? HIGH : LOW);
}

void printReading(float distanceCm, FloodStatus status) {
  if (distanceCm < 0) {
    Serial.print("0");
  } else {
    Serial.print(distanceCm, 1);
  }

  Serial.print(",");
  Serial.println(statusToText(status));
}

void updateLcd(float distanceCm, FloodStatus status) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Dist: ");

  if (distanceCm < 0) {
    lcd.print("--.-");
  } else {
    lcd.print(distanceCm, 1);
  }

  lcd.print(" cm");

  lcd.setCursor(0, 1);
  lcd.print("Stat: ");
  lcd.print(statusToLcdText(status));
}

const char* statusToText(FloodStatus status) {
  switch (status) {
    case SAFE:
      return "SAFE";
    case WARNING:
      return "WARNING";
    case DANGER:
      return "DANGER";
    default:
      return "NO_READING";
  }
}

const char* statusToLcdText(FloodStatus status) {
  switch (status) {
    case SAFE:
      return "SAFE";
    case WARNING:
      return "WARNING";
    case DANGER:
      return "DANGER";
    default:
      return "NO READING";
  }
}
