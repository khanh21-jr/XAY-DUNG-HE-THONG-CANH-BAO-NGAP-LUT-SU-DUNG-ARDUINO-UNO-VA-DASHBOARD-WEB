const fields = {
  distance: document.querySelector("#distanceValue"),
  distanceHint: document.querySelector("#distanceHint"),
  level: document.querySelector("#levelValue"),
  gauge: document.querySelector("#levelGauge"),
  status: document.querySelector("#statusBadge"),
  statusValue: document.querySelector("#statusValue"),
  message: document.querySelector("#messageValue"),
  updatedAt: document.querySelector("#updatedAt"),
  connectionMode: document.querySelector("#connectionMode"),
  sampleCount: document.querySelector("#sampleCount"),
  trendValue: document.querySelector("#trendValue"),
  trendHint: document.querySelector("#trendHint"),
  chart: document.querySelector("#historyChart"),
  timeline: document.querySelector("#eventTimeline"),
  historyBody: document.querySelector("#historyBody"),
};

function normalizeStatus(status) {
  return String(status || "NO_READING").toUpperCase();
}

function statusClass(status) {
  return normalizeStatus(status).toLowerCase().replace("_", "-");
}

function statusLabel(status) {
  const labels = {
    SAFE: "An toàn",
    WARNING: "Cảnh báo",
    DANGER: "Nguy hiểm",
    NO_READING: "Mất tín hiệu",
  };

  return labels[normalizeStatus(status)] || "Không rõ";
}

function formatNumber(value, digits = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "--";
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, number));
}

function setLatest(data) {
  const status = normalizeStatus(data.status);
  const level = clampPercent(data.level_percent);
  const className = statusClass(status);

  fields.distance.textContent = formatNumber(data.distance_cm);
  fields.level.textContent = formatNumber(level, 0);
  fields.statusValue.textContent = statusLabel(status);
  fields.message.textContent = data.message || "--";
  fields.updatedAt.textContent = `Cập nhật: ${data.timestamp || "--"}`;
  fields.distanceHint.textContent = buildDistanceHint(data.distance_cm, status);

  fields.status.className = `status-badge ${className}`;
  fields.status.textContent = statusLabel(status);
  fields.gauge.style.setProperty("--level", `${level}%`);
  fields.gauge.className = `level-gauge ${className}`;
}

function buildDistanceHint(distanceCm, status) {
  if (normalizeStatus(status) === "NO_READING") {
    return "Kiểm tra dây tín hiệu ECHO/TRIG";
  }

  const distance = Number(distanceCm);
  if (!Number.isFinite(distance)) {
    return "Ngưỡng nguy hiểm: <= 10 cm";
  }

  if (distance <= 10) {
    return "Nước đang rất gần cảm biến";
  }

  if (distance <= 20) {
    return "Cần theo dõi sát trong vùng cảnh báo";
  }

  return "Ngưỡng cảnh báo: <= 20 cm";
}

function setHistory(items) {
  const rows = Array.isArray(items) ? items : [];
  const visibleRows = rows.slice(-12).reverse();

  fields.sampleCount.textContent = rows.length;
  fields.historyBody.innerHTML = visibleRows.map(buildHistoryRow).join("");
  setChart(rows);
  setTrend(rows);
  setTimeline(rows);
}

function buildHistoryRow(item) {
  const status = normalizeStatus(item.status);
  const className = statusClass(status);

  return `
    <tr>
      <td>${item.timestamp || "--"}</td>
      <td>${formatNumber(item.distance_cm)} cm</td>
      <td>${formatNumber(item.level_percent, 0)}%</td>
      <td class="status-${className}">${statusLabel(status)}</td>
      <td>${item.message || "--"}</td>
    </tr>
  `;
}

function setChart(items) {
  const chartItems = items.slice(-40);
  if (!chartItems.length) {
    fields.chart.innerHTML = "";
    return;
  }

  fields.chart.innerHTML = chartItems
    .map((item) => {
      const level = clampPercent(item.level_percent);
      const className = statusClass(item.status);
      const title = `${item.timestamp || "--"} - ${formatNumber(level, 0)}% - ${statusLabel(item.status)}`;

      return `<span class="chart-bar ${className}" style="height:${Math.max(6, level)}%" title="${title}"></span>`;
    })
    .join("");
}

function setTrend(items) {
  const recent = items.slice(-12);
  if (recent.length < 2) {
    fields.trendValue.textContent = "--";
    fields.trendHint.textContent = "Chưa đủ dữ liệu";
    return;
  }

  const first = Number(recent[0].level_percent);
  const last = Number(recent[recent.length - 1].level_percent);
  const diff = Math.round(last - first);
  const sign = diff > 0 ? "+" : "";

  fields.trendValue.textContent = `${sign}${diff}%`;
  if (diff > 4) {
    fields.trendHint.textContent = "Mức nước đang tăng";
  } else if (diff < -4) {
    fields.trendHint.textContent = "Mức nước đang giảm";
  } else {
    fields.trendHint.textContent = "Mức nước ổn định";
  }
}

function setTimeline(items) {
  const events = items
    .filter((item) => normalizeStatus(item.status) !== "SAFE")
    .slice(-8)
    .reverse();

  if (!events.length) {
    fields.timeline.innerHTML = `
      <div class="event-item">
        <span class="event-dot safe"></span>
        <div>
          <strong class="event-title">Hệ thống đang an toàn</strong>
          <span class="event-time">Chưa có cảnh báo mới</span>
        </div>
      </div>
    `;
    return;
  }

  fields.timeline.innerHTML = events
    .map((item) => {
      const className = statusClass(item.status);
      return `
        <div class="event-item">
          <span class="event-dot ${className}"></span>
          <div>
            <strong class="event-title">${statusLabel(item.status)} - ${formatNumber(item.level_percent, 0)}%</strong>
            <span class="event-time">${item.timestamp || "--"} | ${item.message || "--"}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

async function refreshDashboard() {
  try {
    const [latestResponse, historyResponse, healthResponse] = await Promise.all([
      fetch("/api/latest"),
      fetch("/api/history"),
      fetch("/api/health"),
    ]);

    setLatest(await latestResponse.json());
    setHistory(await historyResponse.json());

    await healthResponse.json();
    fields.connectionMode.textContent = "Chế độ: Arduino";
  } catch (error) {
    fields.status.className = "status-badge danger";
    fields.status.textContent = "Mất kết nối";
    fields.connectionMode.textContent = "Chế độ: lỗi kết nối";
    console.error(error);
  }
}

refreshDashboard();
setInterval(refreshDashboard, 1000);
