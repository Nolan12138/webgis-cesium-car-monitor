<template>
  <el-card>
    <el-input
      v-model="userInput"
      style="width: 240px"
      placeholder="Please input"
      :class="checkUser"
      clearable
    />
    <el-table :data="checkUser" stripe style="width: 100%">
      <el-table-column prop="id" label="Id" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="role" label="Role" />
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="createTime" label="CreateTime" />
      <!-- 删除 -->
      <el-table-column label="删除">
        <template #default="{ row }">
          <el-button
            type="danger"
            @click="deleteId(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <!-- 编辑 -->
      <el-table-column label="编辑">
        <template #default="{ row }">
          <el-button
            type="success"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue';

// 用户信息规则
interface UserInfo {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  email: string;
  createTime: string;
}

// 父组件发数据了接一下吧，bro
const props = defineProps<{
  userlists: UserInfo[]
}>()

// 查询逻辑也整一下吧
const userInput = ref<string>('')
const checkUser = computed<UserInfo[]>(() => {
  const key = userInput.value.trim().toLowerCase()
  if (!key) return props.userlists
  return props.userlists.filter((item) => {
    return item.name.toLowerCase().includes(key) || item.role.toLowerCase().includes(key)
  })
})

// 再通知父组件需要删除了
const emit = defineEmits(['sendDel', 'sendUpdate'])

const deleteId = (id: number): void => {
  emit('sendDel', id)
}

const updateUser = (row: UserInfo ) => {
  emit('sendUpdate', row)
}

</script>

<style>
</style>
