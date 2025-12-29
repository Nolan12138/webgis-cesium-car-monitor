import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CarInfo } from '@/types/cartype'

export const useCesiumStore = defineStore('cesium', () => {
  const carsList = ref<CarInfo[]>([])
  let socket: WebSocket | null = null

  const connectionWebSocket = () => {
    socket = new WebSocket('ws://localhost:3001/ws')

    socket.onopen = () => {
      console.log('✅ WebSocket 连接成功！')
    }

    socket.onerror = (error) => {
      console.error('❌ WebSocket 连接发生错误:', error)
    }

    // 5. 收消息 (核心修改部分)
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // ===============================================
        // 场景 A: 初始化 (Init) - 后端发来完整的车辆档案
        // ===============================================
        if (data.type === 'init') {
          console.log('🚀 初始化：接收全量数据')
          // 这里可以直接覆盖，因为 init 包里有车牌、颜色等所有信息
          carsList.value = data.cars
        }

        // ===============================================
        // 场景 B: 更新 (Update) - 后端只发来变化的坐标
        // ===============================================
        else if (data.type === 'update') {
          // console.log('🚀 更新：接收增量坐标')

          // 遍历后端发来的“更新包”
          data.cars.forEach((newInfo: any) => {
            // 1. 在我们现有的列表里，找到这辆车
            const existCar = carsList.value.find(car => car.id === newInfo.id)

            if (existCar) {
              // 2. ✨ 核心修复：只更新变化的属性！
              // Object.assign(目标, 源)
              // 意思是：把 newInfo 里的新坐标，合并到 existCar 上
              // existCar 原有的 plateNumber 只要 newInfo 里没说要改，就会保留不动
              Object.assign(existCar, newInfo)
            } else {
              // 3. (可选) 如果列表里没这车，说明是新上线的，直接加进去
              carsList.value.push(newInfo)
            }
          })
        }

        else {
          console.warn('⚠️ 未知的数据类型:', data.type)
        }

      } catch (e) {
        console.error('❌ JSON 解析失败', e)
      }
    }

    socket.onclose = () => {
      console.log('🔌 连接断开！')
    }
  }

  const closeWebSocket = () => {
    if (socket) {
      socket.close()
      socket = null
    }
  }

  return {
    carsList,
    closeWebSocket,
    connectionWebSocket
  }
})
