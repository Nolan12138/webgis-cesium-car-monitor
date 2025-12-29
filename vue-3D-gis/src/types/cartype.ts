// 1. 定义车辆数据的接口 (根据 db.json 的结构)
export interface CarInfo {
  id: number;
  plateNumber: string; // 车牌
  status: 'online' | 'offline'; // 状态
  latitude: number;
  longitude: number;
  speed: number;
  heading: number; // 朝向
}
