<template>
  <div class="login-content" style="width: 100%; max-width: 380px; padding: 20px;">
    <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">欢迎回来</h2>

    <el-form size="large">
      <el-form-item>
        <el-select v-model="loginForm.role" placeholder="选择登录身份" style="width: 100%">
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="loginForm.uname" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="loginForm.psd" type="password" placeholder="请输入密码" show-password />
      </el-form-item>

      <el-button type="primary" style="width: 100%" @click="handelLogin">登录</el-button>

      <div style="margin-top: 15px; text-align: center; font-size: 14px;">
        还没有账号？ <router-link to="/auth/register" style="color: #409eff">去注册</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'; // 推荐用 Element 的提示
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore(); //初始化pinia对象
const router = useRouter();

// 定义接口
interface LoginInfo {
  uname: string;
  psd: string;
  role: 'user' | 'admin';
}

// 1. 表单数据
const loginForm = reactive<LoginInfo>({
  uname: '',
  psd: '',
  role: 'user' // 默认选中用户
});

const handelLogin = () => {
  const success = authStore.login(loginForm)
  if (success) {
    setTimeout(() => {
      router.push('/home')
    }, 300);
  }
  else {
    ElMessage.error('用户或者密码错误')
  }
}
</script>
