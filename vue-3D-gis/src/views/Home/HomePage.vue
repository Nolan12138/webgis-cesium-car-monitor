<template>
  <!-- <HomeTable
    :userlists="userLists"
    @sendDel="handelDel"
    @sendUpdate="handelUpdate"
  />
  <el-button type="success" plain @click="handelAdd">Add</el-button>
  <HomeDia
    ref="dialogUse"
    @submit="formUpdate"
  /> -->

  <div class="home-wrapper">
    <div class="sidebar">...</div>

    <div class="map-box">
      <CesiumMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import CesiumMap from '@/components/CesiumMap.vue'
</script>

<style scoped>
.home-wrapper {
  display: flex;
  height: 100vh; /* 全屏 */
}
.map-box {
  flex: 1; /* 占满剩余空间 */
  position: relative;
}
</style>

<!-- <script setup lang="ts">
import axios from 'axios';
// import HomeDia from './Components/HomeDia.vue'
// import HomeTable from './Components/HomeTable.vue'
import { onMounted, ref } from 'vue';

// 用户信息规则
interface UserInfo {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  email: string;
  createTime: string;
}

// 定义一个响应式接收axios获取的数据
// const userLists = reactive({
//   list: [] as UserInfo[]
// })
const userLists = ref<UserInfo[]>([])

const getUserLists = async (): Promise<void> => {
  try {
    const ref = await axios.get('http://localhost:3000/userLists')
    // const promiseObj = ref.data
    // userLists.value = promiseObj
    userLists.value = ref.data
  }
  catch (err) {
    console.error ('数据获取失败，bro!', err)
  }
}

// 删除逻辑
const handelDel = async (id:number) => {
  // 1.你后台得先删除呢吧，要不然只删除前台显示，你可真是个大聪明
  await axios.delete(`http://localhost:3000/userLists/${id}`)
  // 2. 前台也删一下吧，毕竟给老板看的
  const index = userLists.value.findIndex((item): boolean => item.id === id)
  userLists.value.splice(index, 1)
}

// 需要ref自定义属性去控制，子组件提供的方法
const dialogUse = ref()
const isAdd = ref<boolean>(false)

// 增加数据逻辑
const handelAdd = () => {
  dialogUse.value.open()
  isAdd.value = true
}

// 编辑逻辑
const handelUpdate = (row: UserInfo) => {
  dialogUse.value.open(row)
  isAdd.value = false
}

const formUpdate = async (userInfo: UserInfo ) => {
  // 编辑逻辑
  if (!isAdd.value) {
    // 后端的实际修改
    await axios.put(`http://localhost:3000/userLists/${userInfo.id}`, userInfo)
    // 前端的显示编辑
    const index = userLists.value.findIndex((item) => item.id === userInfo.id)
    userLists.value.splice(index, 1 ,userInfo)
  } else {
    // 后端的实际增加
    const newUser = {...userInfo}
    // 2. 暴力删除 id 字段
    // (加 as any 是告诉 TS：我知道 id 是必填项，但我现在就是要删了它发给后端，别管我)
    delete (newUser as any).id
    const res = await axios.post('http://localhost:3000/userLists', newUser)
    // 前端的增加逻辑
    userLists.value.unshift(res.data)
  }
}

// 挂载钩子，实现一进去页面先渲染表格
onMounted (
  getUserLists
)
</script> -->
