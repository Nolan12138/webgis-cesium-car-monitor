<template>
  <div class="container">
    <div class="side-bar">
      <el-table :data="carStore.carsList" stripe style="width: 100%">
        <el-table-column label="车牌列表">
          <template #default="{ row }">
            <div @click="handlePush(row)" class="car-item">
              {{ row.plateNumber }}
              </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 气泡弹窗子组件 -->
    <div id="map-container" style="position: relative;">
      <CarPopup
      :visible="popup.show"
      :x="popup.x"
      :y="popup.y"
      :info="popup.info"
      @click=handleClosePopup() />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    Cartesian3, Color, Viewer,
    ScreenSpaceEventHandler, ScreenSpaceEventType, defined,
    SceneTransforms, ColorBlendMode,
    Math as CesiumMath,
    JulianDate, SampledPositionProperty, PolylineGlowMaterialProperty,
    VelocityOrientationProperty, ExtrapolationType,
    Cartographic, Entity
  } from 'cesium';
  import { onMounted, shallowRef, ref, watch, reactive } from 'vue' // 👈 1. 引入 watch
  import { useCesiumStore } from '@/stores/cesium'
  import type { CarInfo } from '@/types/cartype'
  import 'cesium/Build/Cesium/Widgets/widgets.css'
  import CarPopup from './CarPopup.vue';

  // 1.初始化地球
  const viewerRef = shallowRef<Viewer>()
  // 连接pinia库
  const carStore = useCesiumStore()
  // 创建一个hashmap去存储管理车辆数据
  const carEntityMap = new Map<string, Entity>()

  // 装那量点击的实体
  let selectedEntity: Entity | null = null

  // 定义气泡的状态数据（响应式）
  const popup = reactive({
    show: false,
    x: 0,
    y: 0,
    info: null as any// 车辆信息
  })

  // 2. 渲染钩子里面设置基本的初始化，以及和websocket进行连接
  onMounted(async () => {
    const viewer = new Viewer('map-container', {animation: false, timeline: false,
      baseLayerPicker: false,infoBox: false,
      selectionIndicator: false, terrainProvider: undefined})

    viewerRef.value = viewer

    // 视角跳转到故宫
    viewer.camera.flyTo({destination: Cartesian3.fromDegrees(116.3974, 39.9093, 10000)})

    // 开启时间开关，cesium的时间是关闭的，需要打开才能保证车辆平滑移动
    viewer.clock.shouldAnimate = true

    // 和websocket建立连接
    console.log('准备连接！')
    await carStore.connectionWebSocket()
    console.log('连接成功！')

    clickWindow(viewer)

    // 处理气泡跟随
    viewer.scene.postRender.addEventListener(() => {
      if (popup.show && selectedEntity) {
        updatePopupPostion(viewer, selectedEntity)
      }
    })
  })

  // 2.watch大管家，只有有更新数据，就在地图上渲染
  watch(() => carStore.carsList, (newCarsList) => {
    // 加一个安全锁，如果地球还没有加载出来，就无法监听了
    const viewer = viewerRef.value
    if (!viewer) return

    // 将车辆Id转换为字符串存进去set中，快速查找
    const newCarIdSet = new Set(
      newCarsList.map(car => String(car.id))
    )

    newCarsList.forEach(car => {
      // 直接查找我的hashMap小本本，不要在整个viewer中找了
      const carId = String(car.id)
      if (carEntityMap.has(carId)) {
        // 如果本子上有名儿 => 直接拿出来实体去更新
        const existingEntity = carEntityMap.get(carId)
        updateCar(existingEntity, car)
      } else {
        // 如果本子上没名儿 => 在本子上写上名字
        addCar(viewer, car)
      }
    })

    // 遍历地图上所有的车辆
    // hashMap也可也用forEach进行遍历，不过它遍历existingId的不是索引号，而是关键字
    carEntityMap.forEach((entity, existingId) => {
      if (!newCarIdSet.has(existingId)) {
        viewer.entities.remove(entity)
        carEntityMap.delete(existingId)
        // 如果删除的正好弹窗也开着，那就将弹窗关闭
        if (popup.info?.id === existingId) {
          handleClosePopup()
        }
      }
    })
  },
    {deep: true}
  )

  // 3. 添加车的逻辑
  const addCar = (viewer: Viewer, newCar: CarInfo) => {
    if (!viewer) return
    // 创建插值实例，保存在entity属性里面
    const positionProperty = new SampledPositionProperty()
    // 如果后续断连或者车辆没有接收到最新的位置信息，就将车子停到最后一个位置处
    positionProperty.forwardExtrapolationType = ExtrapolationType.HOLD

    // 然后在地图上渲染
    const entity = viewer.entities.add({
      id: String(newCar.id),
      position: positionProperty,
      // 自动计算朝向 (根据此时此刻的位置和下一秒的位置自动算)
      orientation: new VelocityOrientationProperty(positionProperty),
      path: {
        show: true,
        width: 5,
        material: new PolylineGlowMaterialProperty({glowPower: 0.2}),
        leadTime: 0,
        trailTime: 60
      },
      model: {
        uri: 'models/Duck.glb',
        scale: 1000,
        minimumPixelSize: 128,
        maximumScale: 20000,
        color: newCar.status === 'online'? Color.GREEN : Color.GRAY,
        colorBlendMode: ColorBlendMode.HIGHLIGHT
      }
    })
    // 登记在hashmap，存的是entity而不是简单的车辆对象
    carEntityMap.set(String(newCar.id), entity)
  }

  // 4.更新车的逻辑
  const updateCar = (entity: Entity, updateCar:CarInfo) => {
    // 然后再地图上重新渲染
    const time = JulianDate.addSeconds(JulianDate.now(), 1, new JulianDate())
    const position = Cartesian3.fromDegrees(updateCar.longitude, updateCar.latitude, 5000)
    // 第一次保存车的时候已经将事件插值属性保存在entity属性里面了，现在直接调用即可
    const positionProperty = entity.position
    positionProperty.addSample(time, position)
  }

  // 5.绑定点击事件
  const clickWindow = (viewer: Viewer) => {
    if (!viewer) return
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    // movement就是形参，他其实里面就是{position: { x: 1024, y: 768 }} // 鼠标点击屏幕的像素坐标
    handler.setInputAction((movement: any) => {
      // pick里面的内容{id: Entity, // 👈 这才是你要的“车”，它藏在 id 属性里primitive: ..., // 底层图元信息collection: ...}
      const pick = viewer.scene.pick(movement.position)
      // defined作用就是 if (pick !== undefined && pick !== null) { ... }
      if (defined(pick) && pick.id) {
        selectedEntity = pick.id
        popup.show = true

        // 给弹窗赋值
        popup.info = {
          id: selectedEntity.id,
          longitude: 0,
          latitude: 0
        }
      }else {
        handleClosePopup()
      }
    }, ScreenSpaceEventType.LEFT_CLICK)
  }

  // 6.弹窗关闭
  const handleClosePopup = () => {
    popup.show = false
    selectedEntity = null // 清空选中状态
  }

  // 7.动态更新弹窗的位置
  const updatePopupPostion = (viewer: Viewer, entity: Entity) => {
    // 获取车辆当前的世界坐标
    const position = entity.position?.getValue(viewer.clock.currentTime)

    // 将世界坐标转换为经纬度
    const cartographic = Cartographic.fromCartesian(position);
    const longitude = CesiumMath.toDegrees(cartographic.longitude); // 经度（度）
    const latitude = CesiumMath.toDegrees(cartographic.latitude);   // 纬度（度）

    // 将世界坐标转换为屏幕坐标
    if (position) {
      const canvasPosition = SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        position
      )

      if (canvasPosition) {
        // 赋值给Vue变量，更新div位置
        popup.x = canvasPosition.x
        popup.y = canvasPosition.y - 50

        popup.info = {
          ...popup.info,
          longitude: longitude,
          latitude: latitude
        }
      }
    }
  }

  // 8.侧边栏点击车辆跳转
  const handlePush = (row: CarInfo) => {
    // 获取实体
    const viewer = viewerRef.value
    if (!viewer) return
    // 获取点击的id
    const id = String(row.id)
    // 获取追踪的车辆实体
    const chooseEntity = viewer.entities.getById(id)
    // 让视角追踪该实体
    viewer.trackedEntity = chooseEntity
  }

  // 9.删除车辆的逻辑
</script>

<style scoped src="@/assets/css/MapStyle.css">
</style>
