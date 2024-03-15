import React from 'react';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import './index.scss';

export interface IProps {
  logo?: string;
  href?: string;
  scenarioInfo?: any;
  scenarioDisplayName?: string;
}

const Logo: React.FC<IProps> = (props): React.ReactElement => {
  const { scenarioDisplayName, scenarioInfo } = props;
  const github = scenarioInfo?.github;
  return (
    <div className="lowcode-plugin-logo">
      <a className="logo" target="blank" href={props.href || 'https://lowcode-engine.cn'} style={{ backgroundImage: `url(${props.logo})` }} />
      <div className="scenario-name">{scenarioDisplayName}</div>
      <a target="blank" href={github || 'https://lowcode-engine.cn'} ><img
        className='github'
        src="https://img.alicdn.com/imgextra/i4/O1CN013upU1R1yl5wVezP8k_!!6000000006618-2-tps-512-512.png"
      /></a>
    </div>
  );
};

//Logo插件
const LogoPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;
      const scenarioDisplayName = config.get('scenarioDisplayName');
      const scenarioInfo = config.get('scenarioInfo');
      // 注册 logo widget
      skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'logo',
        content: <Logo scenarioDisplayName={scenarioDisplayName} scenarioInfo={scenarioInfo} />,
        contentProps: {
          logo: "https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg",
          href: 'https://lowcode-engine.cn',
        },
        props: {
          align: 'left',
        },
      });
    },
  };
}

LogoPlugin.pluginName = 'LogoPlugin';
LogoPlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default LogoPlugin;
