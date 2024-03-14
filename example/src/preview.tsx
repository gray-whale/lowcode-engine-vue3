
import { Asset } from '@alilc/lowcode-types';
import VueRenderer from '@mfejs/lowcode-vue-renderer';
import { buildComponents, AssetLoader, noop } from '@mfejs/lowcode-utils';
import { h, createApp, toRaw, Suspense } from 'vue';
import './global.scss';


(window as any)['__VUE_HMR_RUNTIME__'] = {
  reload: noop,
  rerender: noop,
  createRecord: noop,
};

const init = async () => {
  const packages = JSON.parse(window.localStorage.getItem('packages') || '[]');
  const projectSchema = JSON.parse(window.localStorage.getItem('projectSchema') || '{}');
  const { componentsMap: componentsMapArray = [], componentsTree = [] } = projectSchema;

  const componentsMap: any = {};
  componentsMapArray.forEach((component: any) => {
    componentsMap[component.componentName] = component;
  });

  const libraryMap = {};
  const libraryAsset: Asset = [];
  packages.forEach(({ package: _package, library, urls, renderUrls }) => {
    libraryMap[_package] = library;
    if (renderUrls) {
      libraryAsset.push(renderUrls);
    } else if (urls) {
      libraryAsset.push(urls);
    }
  });
  await new AssetLoader().load(libraryAsset);
  const components = await buildComponents(libraryMap, componentsMap);
  console.log("初始化=====");
  console.log(components);
  console.log(componentsTree);
  return { schema: componentsTree[0], components };
};

(async () => {
  const { schema, components } = await init();
  const app = createApp(() => {
    return h('div', { class: 'lowcode-plugin-preview' }, [
      h(Suspense, null, {
        default: () =>
          h(VueRenderer, {
            class: 'lowcode-plugin-sample-preview-content',
            schema: toRaw(schema),
            components: toRaw(components),
          }),
        fallback: () =>
          h('div', { class: 'lowcode-plugin-sample-preview-loading' }, 'loading...'),
      }),
    ]);
  });
  app.mount('#lce-container');
  // app.config.errorHandler = (err) => {
  //   /* 处理错误 */
  //   console.log("打印错误===");
  //   console.log(err);
  // }
})();
// import ReactDOM from 'react-dom';
// import React, { useState } from 'react';
// import { Loading } from '@alifd/next';
// import mergeWith from 'lodash/mergeWith';
// import isArray from 'lodash/isArray';
// import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
// import ReactRenderer from '@alilc/lowcode-react-renderer';
// import { injectComponents } from '@alilc/lowcode-plugin-inject';
// import appHelper from './appHelper';
// import { getProjectSchemaFromLocalStorage, getPackagesFromLocalStorage, getPreviewLocale, setPreviewLocale } from './services/mockService';

// const getScenarioName = function () {
//   if (location.search) {
//     return new URLSearchParams(location.search.slice(1)).get('scenarioName') || 'general';
//   }
//   return 'general';
// }

// const SamplePreview = () => {
//   const [data, setData] = useState({});

//   async function init() {
//     const scenarioName = getScenarioName();
//     const packages = getPackagesFromLocalStorage(scenarioName);
//     const projectSchema = getProjectSchemaFromLocalStorage(scenarioName);
//     const {
//       componentsMap: componentsMapArray,
//       componentsTree,
//       i18n,
//       dataSource: projectDataSource,
//     } = projectSchema;
//     const componentsMap: any = {};
//     componentsMapArray.forEach((component: any) => {
//       componentsMap[component.componentName] = component;
//     });
//     const pageSchema = componentsTree[0];

//     const libraryMap = {};
//     const libraryAsset = [];
//     packages.forEach(({ package: _package, library, urls, renderUrls }) => {
//       libraryMap[_package] = library;
//       if (renderUrls) {
//         libraryAsset.push(renderUrls);
//       } else if (urls) {
//         libraryAsset.push(urls);
//       }
//     });

//     const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

//     // TODO asset may cause pollution
//     const assetLoader = new AssetLoader();
//     await assetLoader.load(libraryAsset);
//     const components = await injectComponents(buildComponents(libraryMap, componentsMap));

//     setData({
//       schema: pageSchema,
//       components,
//       i18n,
//       projectDataSource,
//     });
//   }

//   const { schema, components, i18n = {}, projectDataSource = {} } = data as any;

//   if (!schema || !components) {
//     init();
//     return <Loading fullScreen />;
//   }
//   const currentLocale = getPreviewLocale(getScenarioName());

//   if (!(window as any).setPreviewLocale) {
//     // for demo use only, can use this in console to switch language for i18n test
//     // 在控制台 window.setPreviewLocale('en-US') 或 window.setPreviewLocale('zh-CN') 查看切换效果
//     (window as any).setPreviewLocale = (locale:string) => setPreviewLocale(getScenarioName(), locale);
//   }

//   function customizer(objValue: [], srcValue: []) {
//     if (isArray(objValue)) {
//       return objValue.concat(srcValue || []);
//     }
//   }

//   return (
//     <div className="lowcode-plugin-sample-preview">
//       <ReactRenderer
//         className="lowcode-plugin-sample-preview-content"
//         schema={{
//           ...schema,
//           dataSource: mergeWith(schema.dataSource, projectDataSource, customizer),
//         }}
//         components={components}
//         locale={currentLocale}
//         messages={i18n}
//         appHelper={appHelper}
//       />
//     </div>
//   );
// };

// ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
