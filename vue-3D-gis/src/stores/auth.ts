import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 类型定义保持不变
interface RegisterInfo {
  uname: string;
  psd: string;
  authorization: boolean;
  role: 'user' | 'admin';
}

export const useAuthStore = defineStore('auth', () => {

  // --- 1. State ---
  const userInfo = ref<RegisterInfo[]>([])
  const adminInfo = ref<RegisterInfo[]>([])
  const currentUser = ref<RegisterInfo | null>(null)

  // --- 初始化逻辑 ---
  const initRegister = () => {
    const userStr = localStorage.getItem('user')
    const adminStr = localStorage.getItem('admin')
    const currentStr = localStorage.getItem('current_user')

    if (userStr) {
      try { userInfo.value = JSON.parse(userStr) } catch(e) { userInfo.value = [] }
    }
    if (adminStr) {
      try { adminInfo.value = JSON.parse(adminStr) } catch(e) { adminInfo.value = [] }
    }
    // 恢复登录状态
    if (currentStr) {
      try { currentUser.value = JSON.parse(currentStr) } catch(e) {}
    }
  }

  // 立即初始化
  initRegister()

  // --- 2. Getters
  // 是否已登录
  const isLoggedIn = computed(() => !!currentUser.value?.authorization)
  // 是否是管理员
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  // 获取当前用户名 (防止 null 报错)
  const currentUsername = computed(() => currentUser.value?.uname || '游客')


  // --- 3. Actions ---

  // 注册逻辑
  const register = (newRegister: RegisterInfo) => {
    // 这里的逻辑稍微去重了一下
    const targetList = newRegister.role === 'user' ? userInfo : adminInfo
    const storageKey = newRegister.role === 'user' ? 'user' : 'admin'

    const isExist = targetList.value.find(item => item.uname === newRegister.uname)

    if (isExist) {
      console.log('用户名已经被注册，请重新换一个把giegie')
      return false // 返回 false 方便组件弹窗
    }
    // 这个存入数据库的绝对不要是原件，给一份复印件啊，铁律铁律
    targetList.value.push({ ...newRegister })
    localStorage.setItem(storageKey, JSON.stringify(targetList.value))
    console.log('注册成功！进入相亲相爱大家庭！')
    return true
  }

  // 登录逻辑
  const login = (loginForm: { uname: string, psd: string, role: 'user' | 'admin' }) => {
    const targetList = loginForm.role === 'user' ? userInfo : adminInfo

    // 关键修复：我们要找的是数据库里的那个人，而不是用表单传进来的 loginForm
    const foundUser = targetList.value.find(
      item => item.uname === loginForm.uname && item.psd === loginForm.psd
    )

    if (foundUser) {
      // 找到了！也就是登录成功
      // 复制一份数据给 currentUser
      currentUser.value = { ...foundUser }
      currentUser.value.authorization = true

      localStorage.setItem('current_user', JSON.stringify(currentUser.value))
      return true
    } else {
      console.log('账号或密码错误')
      return false
    }
  }

  // 退出逻辑
  const logout = () => {
    if (currentUser.value) {
      currentUser.value.authorization = false
      currentUser.value = null
    }
    localStorage.removeItem('current_user')
  }

  return {
    userInfo,
    adminInfo,
    currentUser,
    // 暴露 Getters
    isLoggedIn,
    isAdmin,
    currentUsername,
    // 暴露 Actions
    register,
    login,
    logout
  }
})
