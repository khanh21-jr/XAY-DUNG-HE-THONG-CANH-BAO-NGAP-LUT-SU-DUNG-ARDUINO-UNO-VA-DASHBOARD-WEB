<h2 align="center">
<a href="https://dainam.edu.vn/vi/khoa-cong-nghe-thong-tin">
🎓 Faculty of Information Technology (DaiNam University)
</a>
</h2>

<h1 align="center">
XÂY DỰNG HỆ THỐNG CẢNH BÁO NGẬP LỤT SỬ DỤNG ARDUINO UNO VÀ DASHBOARD WEB
</h1>

<div align="center">

<!-- Thay logo.png bằng ảnh của bạn trong repo -->
<img width="180" src="https://github.com/user-attachments/assets/77fe0fd1-2e55-4032-be3c-b1a705a1b574"/>

<br><br>

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-AI-orange?style=for-the-badge&logo=tensorflow)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-green?style=for-the-badge)
![University](https://img.shields.io/badge/DaiNam-University-orange?style=for-the-badge)

</div>

---
# 📖 1. Giới thiệu đề tài

XÂY DỰNG HỆ THỐNG CẢNH BÁO NGẬP LỤT SỬ DỤNG ARDUINO UNO VÀ DASHBOARD WEB là dự án ứng dụng công nghệ Internet of Things (IoT) nhằm giám sát mực nước theo thời gian thực và phát hiện nguy cơ ngập lụt thông qua cảm biến siêu âm HC-SR04.

Hệ thống sử dụng Arduino Uno để thu thập dữ liệu khoảng cách từ cảm biến đến mặt nước, sau đó truyền dữ liệu qua cổng Serial đến ứng dụng Web Dashboard được xây dựng bằng Flask. Dashboard cho phép người dùng theo dõi mực nước, trạng thái cảnh báo và lịch sử dữ liệu theo thời gian thực.

Dự án hướng đến việc xây dựng một giải pháp giám sát ngập lụt đơn giản, chi phí thấp nhưng hiệu quả, có thể triển khai tại các khu vực dân cư, hệ thống thoát nước hoặc vùng có nguy cơ ngập cao.

---

# 🎯 Mục tiêu của đề tài

* Xây dựng hệ thống giám sát mực nước theo thời gian thực.
* Ứng dụng cảm biến siêu âm HC-SR04 trong đo khoảng cách.
* Thiết kế hệ thống cảnh báo ngập lụt tự động.
* Xây dựng Dashboard Web trực quan để hiển thị dữ liệu.
* Lưu trữ và theo dõi lịch sử đo mực nước.
* Nâng cao khả năng nghiên cứu và ứng dụng IoT trong thực tế.

---

# 🔍 2. Chức năng hệ thống

## Giám sát mực nước

✅ Đo khoảng cách bằng cảm biến HC-SR04

✅ Cập nhật dữ liệu theo thời gian thực

✅ Hiển thị trạng thái an toàn hoặc cảnh báo

✅ Hiển thị lịch sử dữ liệu

✅ Điều khiển LED cảnh báo tự động

✅ Hiển thị thông tin trên LCD 1602 I2C

---

# ✨ 3. Tính năng nổi bật

## 🟢 Hệ thống cảm biến

* Đo khoảng cách bằng HC-SR04
* Cập nhật dữ liệu liên tục
* Hoạt động ổn định
* Dễ dàng mở rộng hệ thống

## 🔴 Hệ thống cảnh báo

* Cảnh báo ngập tự động
* Hiển thị trạng thái trực quan
* Điều khiển LED theo mức cảnh báo
* Theo dõi tình trạng nước liên tục

## 🟡 Dashboard Web

* Giao diện hiện đại
* Hiển thị dữ liệu thời gian thực
* Gauge mức nước trực quan
* Biểu đồ lịch sử dữ liệu
* Timeline cảnh báo
* Bảng dữ liệu chi tiết

## 🔵 Hệ thống hiển thị LCD

* Hiển thị khoảng cách đo được
* Hiển thị trạng thái SAFE
* Hiển thị trạng thái WARNING
* Hiển thị trạng thái DANGER
* Hiển thị trạng thái NO_READING

---

# ⚙️ 4. Công nghệ sử dụng

| Thành phần           | Công nghệ sử dụng         |
| -------------------- | ------------------------- |
| Vi điều khiển        | Arduino Uno               |
| Cảm biến             | HC-SR04 Ultrasonic Sensor |
| Hiển thị             | LCD 1602 I2C              |
| Cảnh báo             | LED                       |
| Backend              | Python, Flask             |
| Serial Communication | PySerial                  |
| Frontend             | HTML, CSS, JavaScript     |
| Dashboard            | Chart.js                  |
| Quản lý mã nguồn     | GitHub                    |

---

# 🔌 5. Sơ đồ kết nối phần cứng

## LCD 1602 I2C

| Thiết bị | Chân thiết bị | Arduino Uno |
| -------- | ------------- | ----------- |
| LCD I2C  | GND           | GND         |
| LCD I2C  | VCC           | 5V          |
| LCD I2C  | SDA           | A4          |
| LCD I2C  | SCL           | A5          |

## HC-SR04

| HC-SR04 | Arduino Uno |
| ------- | ----------- |
| VCC     | 5V          |
| GND     | GND         |
| TRIG    | D9          |
| ECHO    | D10         |

## LED

| LED         | Arduino Uno |
| ----------- | ----------- |
| Anode (+)   | D7          |
| Cathode (-) | GND         |

---

# 🚨 6. Trạng thái cảnh báo

| Trạng thái | Điều kiện                   | LED             |
| ---------- | --------------------------- | --------------- |
| SAFE       | Khoảng cách > 20 cm         | Tắt             |
| WARNING    | 10 cm < khoảng cách ≤ 20 cm | Nhấp nháy nhanh |
| DANGER     | Khoảng cách ≤ 10 cm         | Sáng liên tục   |
| NO_READING | Không đọc được cảm biến     | Nhấp nháy chậm  |

LCD hiển thị:

Dòng 1: Khoảng cách đo được

Dòng 2: SAFE / WARNING / DANGER / NO_READING

---

# 📡 7. Dữ liệu truyền Serial

Arduino gửi dữ liệu theo định dạng:

distance_cm,status

Ví dụ:

15.2,WARNING

25.4,SAFE

8.6,DANGER

---

# 📂 8. Cấu trúc dự án

flood-warning-system/

│

├── arduino/

│   └── flood_arduino/

│       └── flood_arduino.ino

│

├── backend/

│   ├── app.py

│   ├── serial_reader.py

│   └── requirements.txt

│

├── frontend/

│   ├── css/

│   ├── js/

│   └── assets/

│

├── run.ps1

├── README.md

---

# ▶️ 9. Cách cài đặt và chạy dự án

## 1️⃣ Clone dự án

git clone <repository-url>

cd flood-warning-system

## 2️⃣ Cài đặt thư viện Python

pip install -r backend/requirements.txt

Hoặc:

pip install flask pyserial

## 3️⃣ Nạp chương trình Arduino

Mở file:

arduino/flood_arduino/flood_arduino.ino

Upload lên Arduino Uno bằng Arduino IDE.

Cài đặt thư viện:

* LiquidCrystal_I2C
* Wire

Nếu LCD không hiển thị:

Thử đổi:

LiquidCrystal_I2C lcd(0x27,16,2);

thành:

LiquidCrystal_I2C lcd(0x3F,16,2);

---

## 4️⃣ Chạy hệ thống bằng PowerShell

Arduino ở COM3:

.\run.ps1

Arduino ở COM5:

.\run.ps1 -SerialPort COM5

Nếu PowerShell bị chặn:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\run.ps1

---

## 5️⃣ Chạy thủ công

cd backend

pip install -r requirements.txt

$env:SERIAL_PORT="COM3"

python app.py

---

## 6️⃣ Truy cập Dashboard

http://127.0.0.1:5001

---

# 📊 10. Dashboard giám sát

Dashboard hiển thị:

* Trạng thái hiện tại của hệ thống
* Gauge mức nước
* Khoảng cách cảm biến
* Số lượng mẫu đã ghi nhận
* Xu hướng dữ liệu gần nhất
* Biểu đồ lịch sử mực nước
* Timeline cảnh báo
* Bảng dữ liệu thời gian thực

---

# 🔄 11. Quy trình hoạt động

<img width="392" height="347" alt="image" src="https://github.com/user-attachments/assets/18ca148a-8db2-4e92-b4b9-d53a3faee218" /><br>

<img width="380" height="321" alt="image" src="https://github.com/user-attachments/assets/353e8596-77b9-4ff6-a522-7c938cb7a5f8" /><br>

<img width="371" height="367" alt="image" src="https://github.com/user-attachments/assets/a2921dfc-5310-460a-aea6-be9ad1efd460" /><br>

<img width="387" height="300" alt="image" src="https://github.com/user-attachments/assets/86ee491b-a817-4bc5-b114-880143152337" />

<img width="292" height="168" alt="image" src="https://github.com/user-attachments/assets/6c977173-5faf-428c-81f8-c76cf4228f11" />

<img width="290" height="258" alt="image" src="https://github.com/user-attachments/assets/83318baf-18f4-4fb1-94f9-b97c1d6bff7a" />

---

# 🚀 12. Hướng phát triển tương lai

* Gửi cảnh báo SMS khi phát hiện ngập.
* Tích hợp Telegram Bot.
* Tích hợp ứng dụng Mobile.
* Lưu dữ liệu trên Cloud.
* Kết nối nhiều cảm biến cùng lúc.
* Tích hợp AI dự đoán nguy cơ ngập.
* Triển khai trên nền tảng IoT thực tế.

---

# 👨‍💻 13. Thông tin sinh viên

Họ và tên: Nguyễn Tuấn Anh

Mã sinh viên: 1671020022

Lớp: CNTT 16-04

Khoa: Công nghệ Thông tin

Trường: Đại học Đại Nam

---

# 📌 14. Kết luận

Đề tài Xây dựng hệ thống cảnh báo ngập lụt sử dụng Arduino Uno và Dashboard Web giúp sinh viên tiếp cận các công nghệ hiện đại như IoT, hệ thống nhúng, truyền thông Serial, phát triển Web Dashboard và xử lý dữ liệu thời gian thực.

Thông qua dự án, sinh viên có cơ hội xây dựng một hệ thống hoàn chỉnh từ phần cứng đến phần mềm, góp phần hỗ trợ công tác giám sát và cảnh báo ngập lụt trong thực tế.

---

🌟 Nếu thấy dự án hữu ích hãy cho một Star trên GitHub 🌟

⭐ ⭐ ⭐ ⭐ ⭐

© 2026 Faculty of Information Technology - Dai Nam University
