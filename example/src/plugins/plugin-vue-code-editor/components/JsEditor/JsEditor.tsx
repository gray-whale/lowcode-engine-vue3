import type { Monaco } from '@monaco-editor/loader';
import type { editor as Editor } from 'monaco-editor';
import type { IPublicTypeRootSchema, IPublicApiMaterial } from '@alilc/lowcode-types';
import React, {
  forwardRef,
  useCallback,
  useRef,
  useEffect,
  type MutableRefObject,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import '@alilc/lowcode-plugin-base-monaco-editor/lib/style';

import vueTypeCode from './types/vue';
import vueRouterTypeCode from './types/vue-router';
import { generate } from 'short-uuid';
import MagicString from 'magic-string';
import { isFunction } from '@knxcloud/lowcode-utils';
import { findOptionNode, parseCode } from './parse';
import type { IEditorInstance } from '@alilc/lowcode-plugin-base-monaco-editor/lib/helper';
import { parse } from 'acorn';

export interface FunctionEventParams {
  functionName: string;
  template?: string;
}

export interface JsEditorProps {
  jsCode?: string;
  material: IPublicApiMaterial;
}

export interface JsEditorInst {
  code: MutableRefObject<string>;
  monaco: MutableRefObject<Monaco>;
  addFunction(params: FunctionEventParams): void;
  focusByFunctionName(name: string): void;
  transformSchema(rawSchema: IPublicTypeRootSchema): IPublicTypeRootSchema | void;
}

function getLibraryMap(material: IPublicApiMaterial) {
  const packages = material.getAssets()?.packages ?? [];
  const packageMap: Record<string, string> = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
  };
  packages.forEach(({ package: _pkg, library }) => {
    if (_pkg) {
      packageMap[_pkg] = library;
    }
  });
  return packageMap;
}

const JsEditor = forwardRef<JsEditorInst, JsEditorProps>((props, ref) => {
  const monacoRef = useRef<Monaco>();
  const editorRef = useRef<Editor.ICodeEditor>();
  const codeRef = useRef<string>(props.jsCode || '');

  const [instance] = useState<JsEditorInst>(() => ({
    code: codeRef as MutableRefObject<string>,
    monaco: monacoRef as MutableRefObject<Monaco>,
    transformSchema(rawSchema: IPublicTypeRootSchema): IPublicTypeRootSchema | void {
      const code = codeRef.current;
      const transformed = { ...rawSchema };
      const libraryMap = getLibraryMap(props.material);
      const { state, methods, lifeCycles } = parseCode(
        transformed.id || (transformed.id = generate()),
        code,
        libraryMap,
      );

      Object.keys(state).length > 0
        ? (transformed.state = state)
        : delete transformed.state;

      Object.keys(methods).length > 0
        ? (transformed.methods = methods)
        : delete transformed.methods;

      Object.keys(lifeCycles).length > 0
        ? (transformed.lifeCycles = lifeCycles)
        : delete transformed.lifeCycles;

      (transformed.meta ?? (transformed.meta = {})).originCode = code;

      return transformed;
    },
    focusByFunctionName(name: string) {
      const { current: monacoEditor } = editorRef;
      const model = monacoEditor?.getModel();
      const matchedResult =
        model &&
        'findMatches' in model &&
        model.findMatches(
          `^\\s*(?:async)?\\s*${name}\\s*\\([\\s\\S]*\\)[\\s\\S]*\\{`,
          false,
          true,
          false,
          null,
          false,
        )?.[0];
      if (matchedResult) {
        setTimeout(() => {
          if (monacoEditor) {
            monacoEditor.revealLineInCenter(matchedResult.range.startLineNumber);
            monacoEditor.setPosition({
              column: matchedResult.range.endColumn,
              lineNumber: matchedResult.range.endLineNumber,
            });
            monacoEditor.focus();
          }
        }, 100);
      }
    },
    addFunction(params: FunctionEventParams) {
      const { current: monaco } = monacoRef;
      const { current: editor } = editorRef;
      const { current: code } = codeRef;

      if (!monaco || !editor) return;

      const model = editor.getModel();
      if (!model) return;

      const ast = parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
      });
      const methodNode = findOptionNode(ast, 'methods');
      const s = new MagicString(code);
      const indentStr = s.getIndentString();
      const functionCode = params.template
        ? params.template
        : `${params.functionName}() {\n}`;

      const indent = (code: string, indentStart: boolean, count = 1): string => {
        let s = new MagicString(code);
        while (count--) {
          s = s.indent(indentStr, { indentStart });
        }
        return s.toString();
      };

      if (methodNode) {
        if (methodNode.type === 'ObjectExpression') {
          const propertyLen = methodNode.properties.length;
          if (propertyLen > 0) {
            const lastProperty = methodNode.properties[propertyLen - 1];
            s.appendRight(lastProperty.end, `,\n${indent(functionCode, true, 2)}`);
          } else {
            const { start, end } = methodNode;
            const content = indent(`{\n${indent(functionCode, true)}\n}`, false);
            s.overwrite(start, end, content.toString());
          }
        } else {
          console.error(
            '[vue-code-editor]: 组件 methdos 选项不是对象字面量，无法自动注册事件处理函数',
          );
        }
      } else {
        const rootNode = findOptionNode(ast, 'root');
        if (rootNode) {
          const propertyLen = rootNode.properties.length;
          if (propertyLen > 0) {
            const lastProperty = rootNode.properties[propertyLen - 1];
            const methodsCode = `\nmethods: {\n${indent(functionCode, true)}\n}`;
            s.appendRight(lastProperty.end, `,${indent(methodsCode, true)}`);
          } else {
            const { start, end } = rootNode;
            const methodsCode = `methods: {\n${indent(functionCode, true, 1)}\n}`;
            s.overwrite(start, end, `{\n${indent(methodsCode, true)}\n}`);
          }
        } else {
          console.error(
            '[vue-code-editor]: 组件 Options 未找到，无法自动注册事件处理函数',
          );
        }
      }

      model.setValue(s.toString());

      params.functionName && this.focusByFunctionName(params.functionName);
    },
  }));

  useEffect(() => {
    if (isFunction(ref)) {
      ref(instance);
    } else if (ref) {
      ref.current = instance;
    }
  }, []);

  const initEditor = useCallback((monaco: Monaco, editor: IEditorInstance) => {
    editorRef.current = editor as Editor.ICodeEditor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(vueTypeCode, 'vue.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      vueRouterTypeCode,
      'vue-router.d.ts',
    );
  }, []);

  return (
    <MonacoEditor
      language="typescript"
      value={props.jsCode}
      height="100%"
      editorDidMount={initEditor}
      onChange={(code) => (codeRef.current = code)}
    ></MonacoEditor>
  );
});

JsEditor.displayName = 'JsEditor';
JsEditor.propTypes = {
  jsCode: PropTypes.string,
};

export default JsEditor;
