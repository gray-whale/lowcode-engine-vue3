import { init, plugins, project } from '@alilc/lowcode-engine';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
// import CodeEditorPlugin from "@alilc/lowcode-plugin-code-editor";
import ManualPlugin from "@alilc/lowcode-plugin-manual";
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import SimulatorResizerPlugin from '@alilc/lowcode-plugin-simulator-select';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';
import { setupHostEnvironment } from '@mfejs/lowcode-utils';

import EditorInitPlugin from './plugins/plugin-editor-init';
import ComponentPanelPlugin from './plugins/plugin-component-panel';
import DefaultSettersRegistryPlugin from './plugins/plugin-default-setters-registry';
import LoadIncrementalAssetsWidgetPlugin from './plugins/plugin-load-incremental-assets-widget';
import SaveSamplePlugin from './plugins/plugin-save-sample';
import PreviewPlugin from './plugins/plugin-preview-sample';
import CustomSetterSamplePlugin from './plugins/plugin-custom-setter-sample';
import CodeEditor from './plugins/plugin-vue-code-editor/';
import LogoPlugin from './plugins/plugin-logo';
import SimulatorLocalePlugin from './plugins/plugin-simulator-locale';
import lowcodePlugin from './plugins/plugin-lowcode-component';
import appHelper from './appHelper';
import './global.scss';

async function registerPlugins() {
  await plugins.register(InjectPlugin);

  await plugins.register(EditorInitPlugin, {
    scenarioName: 'general',
    displayName: 'Vue3组件库',
    info: {
      github: "http://www.github.com/gray-whale/"
    }
  });

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);
  // logo设置
  await plugins.register(LogoPlugin);
  // 组件面板
  await plugins.register(ComponentPanelPlugin);

  await plugins.register(SchemaPlugin, { isProjectSchema: true });

  await plugins.register(ManualPlugin);
  await plugins.register(CodeEditor);
  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  // await plugins.register(ZhEnPlugin);

  await plugins.register(SetRefPropPlugin);

  await plugins.register(SimulatorResizerPlugin);

  await plugins.register(LoadIncrementalAssetsWidgetPlugin);

  // 插件参数声明 & 传递，参考：https://lowcode-engine.cn/site/docs/api/plugins#%E8%AE%BE%E7%BD%AE%E6%8F%92%E4%BB%B6%E5%8F%82%E6%95%B0%E7%89%88%E6%9C%AC%E7%A4%BA%E4%BE%8B
  await plugins.register(DataSourcePanePlugin, {
    importPlugins: [],
    dataSourceTypes: [
      {
        type: 'fetch',
      },
      {
        type: 'jsonp',
      }
    ]
  });

  // await plugins.register(CodeEditorPlugin);

  // 注册出码插件
  // await plugins.register(CodeGenPlugin);

  // await plugins.register(SaveSamplePlugin);

  await plugins.register(PreviewPlugin);

  await plugins.register(CustomSetterSamplePlugin);

  // 设计器区域多语言切换
  // await plugins.register(SimulatorLocalePlugin);

  // await plugins.register(lowcodePlugin);
};

(async function main() {
  await registerPlugins();

  setupHostEnvironment(project, '/js/vue.runtime.global.js');

  init(document.getElementById('lce-container')!, {
    locale: 'zh-CN',
    enableCondition: true,
    enableCanvasLock: true,
    // 默认绑定变量
    supportVariableGlobally: true,
    // enableWorkspaceMode:true,
    requestHandlersMap: {
      fetch: createFetchHandler(),
    },
    appHelper,
    simulatorUrl: ['http://127.0.0.1:9001/vue-simulator-renderer.js', 'http://127.0.0.1:9001/vue-simulator-renderer.css'],
  });
})();
