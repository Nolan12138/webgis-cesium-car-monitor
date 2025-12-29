const fs = require("fs/promises")   // 读写文件用
const path = require("path") // 处理文件路径用

const DATA_PATH = path.join(__dirname, "cars.json")

// 1)读文件 -> 字符串 -> JSON对象
async function load () {
    // fs.readFileSync同步读取，会等文件全部读完才会继续走,可以自己尝试一下异步传递
    // const text = fs.readFileSync(DATA_PATH, "utf-8")
    // return JSON.parse(text);

    // 异步传递试一试
    const text = await fs.readFile(DATA_PATH, "utf-8")
    return JSON.parse(text)
}

// 2）JSON对象 -> 字符串 -> 写回文件
async function save(obj) {
    // null, 2 非常关键，它会让生成的 JSON 文件带有缩进和换行，方便人类阅读。
    await fs.writeFile(DATA_PATH, JSON.stringify(obj, null, 2), "utf-8")
}

// 3) 核心：更新车辆（每500ms更新一下车辆的最新数据）
function step(data) {
    data.cars.forEach((car) => {
        // heading:角度，需要转弧度给sin/cos用
        const rads = (car.heading * Math.PI) / 180;

        // movestep是模拟的步长，可以自己调整
        const movestep = (car.speed || 10) / 1000000

        //简化： 把地球当作平面，小范围可用
        car.longitude += movestep * Math.cos(rads)
        car.latitude += movestep * Math.sin(rads)

        // 偶尔转弯
        if (Math.random() < 0.05) {
            car.heading = (car.heading + (Math.random() - 0.5) * 20 + 360) % 360
        }
    })
}

// 4)让程序持续运行，每500ms做一次load -> step -> save
setInterval(async () => {
    try {
        const data = await load()
        step(data)
        await save(data)
        console.log("update at", new Date().toLocaleTimeString)
    }catch (err) {
        console.error(err)
    }
}, 500)