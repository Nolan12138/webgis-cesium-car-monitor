<template>
  <div class="form-wrapper">
    <h2 class="title">创建账户</h2>
    <p class="sub-title">请填写以下信息完成注册</p>
    <div class="role-tabs">
      <div
        class="tab-item"
        :class="{ active: registerInfo.role === 'user' }"
        @click="registerInfo.role = 'user'"
      >
        普通用户
      </div>
      <div
        class="tab-item"
        :class="{ active: registerInfo.role === 'admin' }"
        @click="registerInfo.role = 'admin'"
      >
        管理员
      </div>
    </div>
    <el-form size="large" class="register-form">
      <el-form-item>
        <el-input
          v-model="registerInfo.uname"
          placeholder="请输入用户名"
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="registerInfo.psd"
          type="password"
          placeholder="设置密码"
          show-password
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="confirmPsd"
          type="password"
          placeholder="确认密码"
          show-password
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item v-if="registerInfo.role === 'admin'">
        <el-input
          v-model="adminKey"
          placeholder="请输入管理员邀请码 (随便填: 666)"
          :prefix-icon="Key"
        />
      </el-form-item>
      <el-button type="primary" class="submit-btn" @click="handleRegister">
        立即注册
      </el-button>
      <div class="footer-link">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="$router.push('/auth/login')">
          去登录
        </el-link>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock, Key } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'; // 引入消息提示

// 引入pinia
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore(); // 初始化storage
const router = useRouter(); // 初始化router

// 定义接口
interface RegisterInfo {
  uname: string;
  psd: string;
  authorization: boolean;
  role: 'user' | 'admin';
}

// 状态数据
const confirmPsd = ref(''); // 确认密码
const adminKey = ref('');   // 管理员密钥

// 注册信息核心对象
const registerInfo = reactive<RegisterInfo>({
  uname: '',
  psd: '',
  authorization: false,
  role: 'user' // 默认为普通用户
});

// 3. 核心注册逻辑
const handleRegister = () => {
  const uname = registerInfo.uname.trim();
  const psd = registerInfo.psd.trim();

  // --- 基础校验 ---
  if (!uname || !psd) {
    ElMessage.warning('用户名和密码不能为空');
    return;
  }
  if (psd !== confirmPsd.value) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  // 如果是管理员，简单模拟一个密钥校验
  if (registerInfo.role === 'admin' && adminKey.value !== '666') {
    ElMessage.error('管理员邀请码错误');
    return;
  }

  // --- 查重逻辑 ---
  const success = authStore.register(registerInfo)
  if (success) {
    ElMessage.success('注册成功！即将跳转登录');
    setTimeout(() => {
      router.push('/auth/login')
    }, 300)
  }
  // pinia的注册逻辑中包含用户名重复，如果重复返回的是false
  else {
    ElMessage.error(`该${registerInfo.role === 'admin' ? '管理员' : '用户'}名已存在`);
  }
}
</script>

<style scoped>
/* 复用 Login 的大部分样式，保持一致性 */
.register-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.register-left {
  width: 65%;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  position: absolute;
  top: 40px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
.logo img { width: 30px; }

.illustration img {
  width: 400px;
  max-width: 80%;
  margin-bottom: 40px;
}

.slogan { text-align: center; color: #4b5563; }
.slogan h3 { font-size: 22px; margin-bottom: 10px; font-weight: 600; }
.slogan p { font-size: 14px; color: #9ca3af; }

.register-right {
  width: 35%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: -5px 0 20px rgba(0,0,0,0.05);
}

.form-wrapper { width: 100%; max-width: 380px; padding: 0 20px; }
.title { font-size: 32px; color: #1f2937; margin-bottom: 10px; font-weight: bold; }
.sub-title { color: #9ca3af; margin-bottom: 30px; font-size: 14px; }

/* 自定义 Tabs 样式 */
.role-tabs {
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 24px;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}
.tab-item.active {
  background: #fff;
  color: #409eff;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* 按钮样式 */
.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 6px;
  margin-top: 10px;
}

.footer-link {
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

/* 统一样式覆盖 */
:deep(.el-input__wrapper) {
  padding: 8px 11px;
}
</style>
