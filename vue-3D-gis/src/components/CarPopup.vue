<template>
  <div
    v-show="visible"
    class="cesium-popup"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="popup-header">
      <span>🚗 {{ info?.plateNumber || '未知车牌' }}</span>
      <span class="close-btn" @click="handleClose">×</span>
    </div>

    <div class="popup-content">
      <p>ID: {{ info?.id }}</p>
      <p>经度: {{ info?.longitude?.toFixed(6) }}</p>
      <p>纬度: {{ info?.latitude?.toFixed(6) }}</p>
      <p>状态: {{ info?.status === 'online' ? '🟢 在线' : '⚫ 离线' }}</p>
    </div>

    <div class="popup-arrow"></div>
  </div>
</template>

<script setup lang="ts">
import type { CarInfo } from '@/types/cartype';

// 定义 Props，不需要赋值给 const props，直接定义，模版里就能直接用了
defineProps<{
  visible: boolean,
  x: number,
  y: number,
  info: CarInfo | null
}>()

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* 一定要把原来的 CSS 拿过来，否则气泡没有样式，是透明或者错位的 */
.cesium-popup {
  position: absolute;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  transition: left 0.1s, top 0.1s;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
  margin-bottom: 5px;
  font-weight: bold;
}

.close-btn {
  cursor: pointer;
  color: #aaa;
}
.close-btn:hover {
  color: #fff;
}

.popup-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  margin-left: -6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.8);
}
</style>
