import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import { material, project } from '@alilc/lowcode-engine';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
import { filterPackages } from '@alilc/lowcode-plugin-inject'
import { Message } from '@alifd/next';

// 预览
const PreviewPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;
      const doPreview = () => {
        saveSchema();
        setTimeout(() => {
          window.open('./preview.html');
        }, 500);
      };
      skeleton.add({
        name: 'previewSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button type="primary" onClick={() => doPreview()}>
            预览
          </Button>
        ),
      });
    },
  };
}

export const saveSchema = async () => {
  window.localStorage.setItem(
    "projectSchema",
    JSON.stringify(project.exportSchema(IPublicEnumTransformStage.Save))
  );

  const packages = await filterPackages(material.getAssets().packages);
  window.localStorage.setItem(
    'packages',
    JSON.stringify(packages),
  );
  Message.success('成功保存到本地');
};

PreviewPlugin.pluginName = 'PreviewPlugin';
PreviewPlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default PreviewPlugin;
