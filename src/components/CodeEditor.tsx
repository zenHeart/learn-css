import React, { useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { oneDark } from '@codemirror/theme-one-dark'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'

interface CodeEditorProps {
  value: string
  language: 'html' | 'css' | 'javascript'
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  placeholder = '',
  readOnly = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  // 根据语言选择对应的语言支持
  const getLanguageSupport = () => {
    switch (language) {
      case 'html':
        return html()
      case 'css':
        return css()
      case 'javascript':
        return javascript()
      default:
        return html()
    }
  }

  useEffect(() => {
    if (!editorRef.current) return

    // 创建编辑器状态
    const state = EditorState.create({
      doc: value,
      extensions: [
        getLanguageSupport(),
        oneDark,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-editor': {
            height: '100%',
          },
          '.cm-scroller': {
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          },
        }),
        readOnly ? EditorState.readOnly.of(true) : [],
      ],
    })

    // 创建编辑器视图
    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [language, readOnly])

  // 当 value 从外部更新时，同步到编辑器
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString()
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        })
      }
    }
  }, [value])

  return (
    <div className="code-editor">
      <div className="editor-header">
        <span className="language-badge">{language.toUpperCase()}</span>
      </div>
      <div className="editor-container">
        <div ref={editorRef} className="editor-content" />
      </div>
    </div>
  )
}

export default CodeEditor 