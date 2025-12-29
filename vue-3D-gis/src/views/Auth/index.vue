<template>
  <!-- 左侧背景配置 -->
  <div class="auth-layout">
    <div class="auth-left">
      <div class="logo">
        <img src="https://element-plus.org/images/element-plus-logo.svg" alt="logo" />
        <span>Art Design Pro</span>
      </div>
      <div class="illustration">
        <img src="https://undraw.co/api/design/s1/image/updated/authentication.svg" alt="bg" />
      </div>
      <div class="slogan">
        <h3>3D可视化地球开发</h3>
        <p>Celeum3D的数据管理平台</p>
      </div>
    </div>
    <!-- 右侧路由配置，切换注册和登录逻辑 -->
    <div class="auth-right">
      <RouterView></RouterView>
    </div>
  </div>
</template>


<style scoped>
/* 左右布局样式 */
.auth-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
.auth-left {
  width: 65%;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  position: relative;
}
.auth-right {
  width: 35%; background: #fff;
  display: flex; justify-content: center; align-items: center;
}
/* 这里把通用的 logo/slogan 样式写上，Login 和 Register 就不用重复写了 */
.logo { position: absolute; top: 40px; left: 40px; display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 20px;}
.logo img { width: 30px; }
.illustration img { width: 80%; max-width: 500px; margin-bottom: 30px; }
.slogan { text-align: center; }
</style>
