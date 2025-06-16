import Editor from '@/components/editor/Editor'
import EditorNav from '@/components/editor/EditorNav'
import Toolbar from '@/components/editor/Toolbar'
import React from 'react'

type Props = {}

function page({}: Props) {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full space-y-4'>
      <EditorNav/>
      <div className='mt-6'>
      <Toolbar/>
      </div>
      <Editor/>
    </div>
  )
}

export default page