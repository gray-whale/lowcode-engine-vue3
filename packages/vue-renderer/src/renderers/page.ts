import { defineComponent, h } from 'vue';
import { useRenderer, rendererProps, useRootScope } from '../core';

const Page = defineComponent((props, { slots }) => {
  return () => h('div', { class: 'lc-page', style: { height: '100%' }, ...props }, slots);
});

/**
 * PageRenderer组件
 * @const {Object} PageRenderer
 */
export const PageRenderer = defineComponent({
  /**
   * 组件名称
   * @type {string}
   */
  name: 'PageRenderer',
  /**
   * 组件属性
   * @type {Object}
   */
  props: rendererProps,
  /**
   * 标记为渲染器
   * @type {boolean}
   */
  __renderer__: true,
  /**
   * 组件设置函数
   * @param {Object} props - 组件属性
   * @param {Object} context - 上下文对象
   * @returns {Function} - 渲染函数
   */
  setup(props, context) {
    // 获取根作用域和包装渲染函数
    const { scope, wrapRender } = useRootScope(props, context);
    // 获取渲染组件、组件引用和模式引用
    const { renderComp, componentsRef, schemaRef } = useRenderer(props, scope);

    // 返回包装后的渲染函数
    return wrapRender(() => {
      // 渲染组件
      return renderComp(schemaRef.value, scope, componentsRef.value.Page || Page);
    });
  },
});
