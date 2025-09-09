'use client'

import { $getRoot, $getSelection } from 'lexical'
import { $generateHtmlFromNodes } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import {
  FORMAT_TEXT_COMMAND,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
} from 'lexical'
import { useCallback, useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

// Define the initial config for the editor
const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  paragraph: 'mb-2',
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const handleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  }

  const handleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  }

  const handleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
      <Button
        type="button"
        variant={isBold ? "default" : "ghost"}
        size="sm"
        onClick={handleBold}
        className="h-8 px-2 font-bold"
      >
        B
      </Button>
      <Button
        type="button"
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        onClick={handleItalic}
        className="h-8 px-2 italic"
      >
        I
      </Button>
      <Button
        type="button"
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        onClick={handleUnderline}
        className="h-8 px-2 underline"
      >
        U
      </Button>
    </div>
  )
}

interface RichTextEditorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
}

export function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Enter text...', 
  className,
  error 
}: RichTextEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const lastValueRef = useRef(value)
  
  // Reset initialization when value changes (for when form data loads)
  useEffect(() => {
    if (value !== lastValueRef.current) {
      setIsInitialized(false)
      lastValueRef.current = value
    }
  }) // No dependency array - runs on every render to check for prop changes

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error)
    },
    editorState: undefined, // Start with empty editor
  }

  // Handle content changes with debouncing
  const handleChange = useCallback((editorState: {read: (fn: () => void) => void}, editor: {read?: (fn: () => void) => void}) => {
    editorState.read(() => {
      try {
        // Generate HTML from the current editor state
        const htmlString = $generateHtmlFromNodes(editor as Parameters<typeof $generateHtmlFromNodes>[0], null)
        
        // Only update if content actually changed
        if (htmlString !== lastValueRef.current) {
          lastValueRef.current = htmlString
          onChange(htmlString)
        }
      } catch (error) {
        console.warn('Error generating HTML:', error)
      }
    })
  }, [onChange])

  // Initialize content safely
  const InitializeContentPlugin = () => {
    const [editor] = useLexicalComposerContext()
    
    useEffect(() => {
      if (!isInitialized && value && value.trim() !== '' && value !== '<p></p>' && value !== '<p><br></p>') {
        editor.update(() => {
          try {
            const root = $getRoot()
            root.clear()
            
            // Parse HTML content to preserve basic formatting
            let htmlContent = value
              .replace(/&nbsp;/g, ' ')
              .replace(/&ldquo;/g, '"')
              .replace(/&rdquo;/g, '"')  
              .replace(/&amp;/g, '&')
              .trim()
            
            // Remove paragraph tags and clean up
            htmlContent = htmlContent
              .replace(/<\/p>/gi, '\n')
              .replace(/<p[^>]*>/gi, '')
              .replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
            
            if (htmlContent) {
              // Split by paragraphs (double newlines or single newlines)
              const paragraphs = htmlContent.split(/\n+/).filter(p => p.trim())
              
              if (paragraphs.length === 0) {
                paragraphs.push(htmlContent)
              }
              
              paragraphs.forEach(paragraphText => {
                if (paragraphText.trim()) {
                  const paragraphNode = $createParagraphNode()
                  
                  // Parse inline formatting using a more robust approach
                  const parseTextWithFormatting = (text: string) => {
                    const tempDiv = document.createElement('div')
                    tempDiv.innerHTML = text
                    
                    const processNode = (node: Node) => {
                      if (node.nodeType === Node.TEXT_NODE) {
                        const textContent = node.textContent || ''
                        if (textContent.trim()) {
                          const textNode = $createTextNode(textContent)
                          paragraphNode.append(textNode)
                        }
                      } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element
                        const textContent = element.textContent || ''
                        
                        if (textContent.trim()) {
                          const textNode = $createTextNode(textContent)
                          
                          // Apply formatting based on tag name
                          const tagName = element.tagName.toLowerCase()
                          if (tagName === 'em' || tagName === 'i') {
                            textNode.toggleFormat('italic')
                          }
                          if (tagName === 'strong' || tagName === 'b') {
                            textNode.toggleFormat('bold')
                          }
                          if (tagName === 'u') {
                            textNode.toggleFormat('underline')
                          }
                          
                          paragraphNode.append(textNode)
                        }
                      }
                    }
                    
                    // Process all child nodes
                    Array.from(tempDiv.childNodes).forEach(processNode)
                  }
                  
                  parseTextWithFormatting(paragraphText)
                  
                  // If paragraph is empty, add it anyway to maintain structure
                  if (paragraphNode.getChildren().length === 0) {
                    const emptyTextNode = $createTextNode('')
                    paragraphNode.append(emptyTextNode)
                  }
                  
                  root.append(paragraphNode)
                }
              })
            }
            
            setIsInitialized(true)
          } catch (error) {
            console.warn('Failed to initialize content:', error)
            setIsInitialized(true)
          }
        })
      } else if (!isInitialized) {
        setIsInitialized(true)
      }
    }, [editor, value])

    return null
  }

  return (
    <div className={cn("border border-border rounded-md overflow-hidden", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[150px] p-4 outline-none resize-none focus:ring-0"
                style={{
                  minHeight: '150px',
                }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={(editorState, editor) => handleChange(editorState, editor)} />
          <HistoryPlugin />
          <InitializeContentPlugin />
        </div>
      </LexicalComposer>
      {error && (
        <p className="text-sm text-destructive mt-1 px-4 pb-2">{error}</p>
      )}
    </div>
  )
}