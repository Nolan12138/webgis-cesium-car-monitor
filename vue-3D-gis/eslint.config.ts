import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'], // 原有 Vue 基础规则
  vueTsConfigs.recommended, // 原有 TS 推荐规则

  // 新增：覆盖 vue/multi-word-component-names 规则，允许组件名是 index
  {
    name: 'app/vue-component-rules',
    rules: {
      // 组件名必须多单词，但忽略 index（适配 index.vue 入口组件）
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index'], // 关键：添加 index 到忽略列表
        },
      ],
    },
  },
);
