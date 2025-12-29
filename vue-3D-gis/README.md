# WebGIS 车辆实时监控平台（Cesium + Vue3）

基于 Vue3 + TypeScript + CesiumJS 的 3D WebGIS 前端项目，实现车辆列表联动定位、实体拾取、弹窗跟随与轨迹/运动模拟等功能。

## 技术栈
- Vue3 / TypeScript / Vite
- Pinia / Vue Router / Element Plus
- CesiumJS / Axios

## 功能亮点
- 车辆实体渲染与视角飞行定位（flyTo）
- 列表-地图联动（点击车牌定位）
- 实体拾取与详情弹窗（弹窗随渲染帧跟随）
- 基于 SampledPositionProperty 的轨迹采样与运动模拟

## 快速开始
```bash
npm install
npm run dev

数据接口
npm i -g json-server
json-server --watch db.json --port 3000
