import { defineComponent, h } from 'vue';

/**
 * 定义了一个名为"Page"的组件。它是一个函数式组件
 * @param {Object} props - 组件属性
 * @param {Object} slots - 子组件
 * @returns {Object} - 返回一个函数，用于渲染组件
 */
const Page = defineComponent((props, { slots }) => {
  // 返回一个函数，用于渲染组件
  return () => h('div', { class: 'lc-page', ...props }, slots);
});

// 给组件添加元数据
Object.assign(Page, {
  displayName: 'Page', // 组件名称
  componentMetadata: {
    componentName: 'Page', // 组件名称
    configure: {
      supports: {
        style: true, // 支持样式
        className: true, // 支持类名
      },
      component: {
        isContainer: true, // 是否为容器组件
        disableBehaviors: '*', // 禁用所有行为
      },
    },
  },
});

export default Page;
