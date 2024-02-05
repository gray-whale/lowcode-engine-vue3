import type {
  GlobalEvent,
  IPublicModelNode,
  IPublicTypeDisposable,
} from '@alilc/lowcode-types';
import type { InjectionKey } from 'vue';
import type { DesignMode } from './renderer-context';
import { inject } from 'vue';

export type IPublicTypePropChangeOptions = Omit<
  GlobalEvent.Node.Prop.ChangeOptions,
  'node'
>;

export interface INode extends IPublicModelNode {
  onVisibleChange(func: (flag: boolean) => any): () => void;
  onPropChange(func: (info: IPublicTypePropChangeOptions) => void): IPublicTypeDisposable;
  onChildrenChange(
    fn: (param?: { type: string; node: INode } | undefined) => void,
  ): IPublicTypeDisposable | undefined;
}

export interface EnvNode {
  mode: DesignMode;
  node: INode | null;
  isDesignerEnv: boolean;
}

export interface DesignerEnvNode extends EnvNode {
  mode: 'design';
  node: INode;
  isDesignerEnv: true;
}

export interface LiveEnvNode extends EnvNode {
  mode: 'live';
  node: null;
  isDesignerEnv: false;
}

export type CurrentNode = DesignerEnvNode | LiveEnvNode;

export function getCurrentNodeKey(): InjectionKey<CurrentNode> {
  let key = (window as any).__currentNode;
  if (!key) {
    key = Symbol('__currentNode');
    (window as any).__currentNode = key;
  }
  return key;
}

export function useCurrentNode(): CurrentNode {
  const key = getCurrentNodeKey();
  return inject(
    key,
    () => {
      return {
        mode: 'live',
        node: null,
        isDesignerEnv: false,
      } as LiveEnvNode;
    },
    true,
  );
}
