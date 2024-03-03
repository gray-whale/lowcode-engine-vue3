import type { IPublicTypePlugin } from '@alilc/lowcode-types';
import React from 'react';
import icon from './icon';
import { CodeEditorPane } from './pane';
import 'uno.css';
import './style.css';

const plugin: IPublicTypePlugin = ({ project, skeleton, event, material }) => {
  return {
    // 插件对外暴露的数据和方法
    exports: () => ({}),
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    async init() {
      const schemaDock = skeleton.add({
        area: 'leftArea',
        name: 'codeEditor',
        type: 'PanelDock',
        props: {
          icon,
          description: '源码面板',
        },
        panelProps: {
          width: '500px',
          title: '源码面板',
        },
        content: (
          <CodeEditorPane
            material={material}
            project={project}
            skeleton={skeleton}
            event={event}
          />
        ),
      });

      if (schemaDock) {
        schemaDock.disable();
        project.onSimulatorRendererReady(() => {
          schemaDock.enable();
        });
      }
    },
  };
};

plugin.pluginName = 'vueCodeEditor';

export default plugin;
