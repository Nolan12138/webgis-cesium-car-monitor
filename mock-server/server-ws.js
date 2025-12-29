// server-ws.js = HTTP(给你调试用) + WebSocket(实时推送)
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());

const DATA_PATH = path.join(__dirname, "cars.json");

// 1) 启动时读一次 cars.json 到内存
let data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
// 保险：确保 data.cars 是数组
data.cars = Array.isArray(data.cars) ? data.cars : [];

// 2) 内存更新逻辑：每 1s 更新一次
function step() {
  // 将增量保存起来
  const updates = []

  data.cars.forEach((car) => {
    const rads = (car.heading * Math.PI) / 180;
    const moveStep = (car.speed || 10) / 1000;

    car.longitude += moveStep * Math.cos(rads);
    car.latitude += moveStep * Math.sin(rads);

    if (Math.random() < 0.05) {
      car.heading = (car.heading + (Math.random() - 0.5) * 20 + 360) % 360;
    }

    updates.push({
      id: car.id,
      longitude: car.longitude,
      latitude: car.latitude,
      heading: car.heading
    })
  });
  // 将更新的数据保存下来
  return updates
}

// 3) HTTP 接口（可留可不留）：浏览器访问可看数据
app.get("/cars", (req, res) => {
  res.json({ cars: data.cars, ts: Date.now() });
});

// 4) 让 express 真正开始监听端口
const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`✅ HTTP: http://localhost:${PORT}/cars`);
  console.log(`✅ WS : ws://localhost:${PORT}/ws`);
});

// 5) 在同一个端口上挂 WebSocket 服务
const wss = new WebSocketServer({ server, path: "/ws" });

// 广播：把消息发给所有已连接的前端
function broadcast(updates) {
  wss.clients.forEach((client) => {
    // 判断用户是否连接成功
    if (client.readyState === 1) {
      client.send(JSON.stringify({
          type: "update",
          cars: updates,
          ts: Date.now()
      }))
    }
  });
}

// 有前端连上来时触发（监听器）
wss.on("connection", (ws) => {
  // // 限制
  // ws.longitude = 100
  // ws.latitude = 32
  console.log("✅ WS client connected");

  // 连上先发一次全量数据（让前端初始化车辆）
  ws.send(JSON.stringify({ type: "init", cars: data.cars, ts: Date.now() }));

  ws.on("close", () => console.log("❎ WS client disconnected"));
});

// 6) 定时更新 + 推送（WS 的核心）
setInterval(() => {
  const updates = step()
  broadcast(updates); // 推送给前端
}, 1000);




