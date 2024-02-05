import { defineComponent, h, renderSlot } from 'vue';

const Slot = defineComponent({
  render() {
    return renderSlot(this.$slots, 'default', this.$props, () => {
      return [h('div', { class: 'lc-container' })];
    });
  },
});

Object.assign(Slot, {
  displayName: 'Slot',
  componentMetadata: {
    componentName: 'Slot',
    configure: {
      props: [
        {
          name: '___title',
          title: '插槽标题',
          setter: 'StringSetter',
          defaultValue: '插槽容器',
        },
        {
          name: '___params',
          title: '插槽入参',
          setter: {
            componentName: 'ArraySetter',
            props: {
              itemSetter: {
                componentName: 'StringSetter',
                props: {
                  placeholder: '参数名称',
                },
              },
            },
          },
        },
      ],
      component: {
        isContainer: true,
        disableBehaviors: '*',
      },
      supports: false,
    },
  },
});

export default Slot;
