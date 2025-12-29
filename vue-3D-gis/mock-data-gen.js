// mock-data-gen.js
import fs from 'fs'; // 🔥 改成了 import

const generateCars = (count) => {
  const cars = [];
  // 北京天安门附近的坐标范围
  const baseLat = 39.9093;
  const baseLon = 116.3974;

  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lonOffset = (Math.random() - 0.5) * 0.1;

    cars.push({
      id: i + 1,
      // 模拟车牌
      plateNumber: `京A·${Math.floor(Math.random() * 9000 + 1000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      // 状态
      status: Math.random() > 0.2 ? 'online' : 'offline',
      // 位置
      latitude: baseLat + latOffset,
      longitude: baseLon + lonOffset,
      speed: Math.floor(Math.random() * 60),
      heading: Math.floor(Math.random() * 360)
    });
  }
  return { cars };
};

const data = generateCars(20);

// 写入文件
fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

console.log('✅ 虚拟数据生成完毕！请运行 json-server 启动接口。');
