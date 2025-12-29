<template>
  <el-dialog v-model="visible" :title="isEdit ? '编辑' : '新增'">
    <!-- 填入输入框 -->
    <el-form :model="formData">
      <el-form-item label="Id">
        <el-input v-model="formData.id" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Role">
        <el-select v-model="formData.role" placeholder="Please select a zone">
          <el-option label="User" value="user" />
          <el-option label="Admin" value="admin" />
        </el-select>
      </el-form-item>

      <el-form-item label="Status">
        <el-select v-model="formData.status" placeholder="Please select a zone">
          <el-option label="Close" :value="0" />
          <el-option label="Open" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="Email">
        <el-input v-model="formData.email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="CreatTime">
        <el-input v-model="formData.createTime" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue'

// 定义接口
interface UserInfo {
  id: number;
  name: string;
  role: 'admin' | 'user';
  status: 0 | 1;
  email: string;
  createTime: string;
}

// 初始化空数据
const formData = ref<UserInfo>({
  id: 0,
  name: '',
  role: 'user',
  status: 0,
  email: '',
  createTime: ''
})

const clearForm = () => {
  formData.value = {
    id: 0,
    name: '',
    role: 'user',
    status: 0,
    email: '',
    createTime: ''
  }
}

// 1. 定义 emit ('submit')
const emit = defineEmits(['submit'])

// 2. 内部数据
const visible = ref(false)
const isEdit = ref(false)

// 3. 暴露 open 方法
const open = (row?: UserInfo) => {
  // 先将弹窗打开
  visible.value = true
  // 若是父组件调用的时候，传递数据了那就是编辑，没传数据那就是新增
  isEdit.value = row ?  true : false
  // 编辑逻辑
  if (row) {
    // 因为没有嵌套，用浅拷贝即可
    formData.value = { ... row }
  }
}

const handleSave = () => {
  // 将副本扔出去,父组件就不用再次浅拷贝了？我猜测哈
  emit('submit', { ...formData.value })
  visible.value = false
}

// watch监听，弹窗以关闭立刻清空弹窗表单
watch(visible, (newVal) => {
  // newVal 为 false，说明弹窗正在关闭
  if (!newVal) {
    clearForm() // 清空表单
    isEdit.value = false // 重置编辑状态
  }
})

defineExpose({ open })
</script>
