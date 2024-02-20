import { defineComponent, renderSlot } from 'vue';

/**
 * 定义了一个名为"Leaf"的Vue组件。该组件的主要功能是渲染其默认插槽的内容。
 */
const Leaf = defineComponent({
  /**
   * 组件名称
   */
  name: 'Leaf',
  /**
   * 渲染函数
   * @returns {VNode} 返回一个插槽节点
   */
  render() {
    return renderSlot(this.$slots, 'default');
  },
});

/**
 * 给Leaf添加元数据
 */
Object.assign(Leaf, {
  /**
   * 组件显示名称
   */
  displayName: 'Leaf',
  /**
   * 组件元数据
   */
  componentMetadata: {
    /**
     * 组件名称
     */
    componentName: 'Leaf',
    /**
     * 配置项
     */
    configure: {
      /**
       * 属性列表
       */
      props: [
        {
          /**
           * 属性名称
           */
          name: 'children',
          /**
           * 属性设置器
           */
          setter: 'StringSetter',
        },
      ],
      /**
       * 是否支持
       */
      supports: false,
    },
  },
});

export default Leaf;
