'use client'

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import { useEditorStore } from '@/store/useEditorStore';
import Code from '@tiptap/extension-code';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote'
import { useBlogStore } from '@/store/useBlogStore';



function Editor() {

    const { setEditor } = useEditorStore();
    const { setContent} = useBlogStore();

  

    const editor = useEditor({
        onCreate({ editor }) {
           setEditor(editor);
            setContent(editor.getHTML());
        },

        onDestroy() {
            setEditor(null);
        },

        onUpdate({ editor }) {
            setEditor(editor);
            setContent(editor.getHTML());
        },

        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },

        onTransaction({ editor }) {
            setEditor(editor);
        },

        onFocus({ editor }) {
            setEditor(editor);
        },

        onBlur({ editor }) {  
            setEditor(editor);
        },

        editorProps:{
            attributes: {
                style: "padding-left: 56px; padding-right: 56px",
                class: "focus:outline-none flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text"
            },
        },
        extensions: [
            StarterKit, 
            TaskItem.configure({
                nested: true,
            }), 
            TaskList,
            Table,
            TableCell,
            TableHeader,
            TableRow,
            Image,
            ImageResize,
            Code,
            FontFamily,
            TextStyle,
            Link.configure({
              openOnClick: true,
              autolink: true,
              defaultProtocol: 'https',
              linkOnPaste: true,
            }),
            Blockquote

        ], 
    })

  return (
    <div className='size-full overflow-x-hidden overflow-y-auto flex items-center justify-center px-4'>
        <div className='min-w-max flex justify-center w-[816px] mx-auto'>
            
        <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default Editor