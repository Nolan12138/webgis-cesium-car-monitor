const fs = require("fs")
const fsP = require("fs/promises")
const path = require("path")
const express = require("express")
const cors = require("cors")

const app = express()
app.use((cors())) // 允许跨域；前端才能访问这个服务

const DATA_PATH = path.join(__dirname, "cars.json")

// 1)启动是读一次文件到内存
let data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))

// 2) 每 500ms 更新一次内存里的车辆位置（相当于把 moveCars 搬到后端）
function step() {
    data.cars.forEach((car) => {
      const rads = (car.heading * Math.PI) / 180;
      const moveStep = (car.speed || 10) / 1000000;
  
      car.longitude += moveStep * Math.cos(rads);
      car.latitude  += moveStep * Math.sin(rads);
  
      if (Math.random() < 0.05) {
        car.heading = (car.heading + (Math.random() - 0.5) * 20 + 360) % 360;
      }
    });
  }

// 每500ms，更新内存数据
setInterval(step, 500)

setInterval(async() => {
    await fsP.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}, 2000)

// 3)提供一个HTTP接口：GET/cars
// 前端axios请求这个接口拿到最新的数据
app.get("/cars", (req, res) => {
    res.json(
        {
            cars: data.cars,
            ts: Date.now()
        }
    )
})

// 4)启动服务，监听端口3001
app.listen(3001, () => {
    console.log("✅ HTTP server running: http://localhost:3001");
    console.log("✅ Try: http://localhost:3001/cars");
})
