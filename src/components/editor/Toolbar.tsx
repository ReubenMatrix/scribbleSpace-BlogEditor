"use client"


import { ToolbarButtonProps } from '@/lib/types';
import { Bold, ChevronDownIcon, Code, Image, Italic, Link, List, ListOrdered, ListTodo, LucideIcon, MessageSquareQuote, Redo, Redo2Icon, Strikethrough, Undo, Undo2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/useEditorStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const HeadingButton = () => {
    const { editor } = useEditorStore();
    
    const headings = [
        { label: "Normal", level: 0 },
        { label: "Heading 1", level: 1 },
        { label: "Heading 2", level: 2 },
        { label: "Heading 3", level: 3 },
    ] as const;

    const currentLevel = [1, 2, 3, 4, 5, 6].find(level => 
        editor?.isActive('heading', { level })
    ) || 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='h-7 w-[100px] flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm'>
                    <span className='truncate'>
                        {currentLevel ? `Heading ${currentLevel}` : "Normal"}
                    </span>
                    <ChevronDownIcon className='ml-2 size-4 shrink-0' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
                {headings.map((heading) => (
                    <button
                        key={heading.level}
                        onClick={() => {
                            if (heading.level === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({ level: heading.level as 1 | 2 | 3 }).run();
                            }
                        }}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            heading.level === currentLevel && "bg-neutral-200/80"
                        )}
                    >
                        <span className='text-sm'>{heading.label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ImageUploadButton = () => {
  const { editor } = useEditorStore()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/blog-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()

      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Image upload error:', error)
    }
  }

  return (
    <label
      className={cn(
        'text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 cursor-pointer'
      )}
    >
      <Image className="size-5" strokeWidth={1.5} />
      <input type="file" accept="image/*" hidden onChange={handleFileChange} />
    </label>
  )
}


const LinkButton = () => {
    const { editor } = useEditorStore()

    const currentHref = editor?.getAttributes("link").href ?? ""
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState(currentHref)

    useEffect(() => {
        if (!open) setUrl(currentHref)
    }, [open, currentHref])

    const applyLink = (href: string) => {
        if (!editor) return
        if (url.trim() === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href })
                .run()
        }
        setOpen(false)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                        editor?.isActive("link") && "bg-neutral-200/80"
                    )}
                >
                    <Link className="size-4" strokeWidth={2} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-72 p-2 flex flex-col gap-2"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <input
                    type="url"
                    autoFocus
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            applyLink(url)
                        }
                    }}
                    className="w-full rounded-sm border px-2 py-1 text-sm outline-none
                     focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-2">
                    {editor?.isActive("link") && (
                        <button
                            onClick={() => {
                                editor
                                    ?.chain()
                                    .focus()
                                    .extendMarkRange("link")
                                    .unsetLink()
                                    .run()
                                setOpen(false)
                            }}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Remove
                        </button>
                    )}

                    <button
                        onClick={() => applyLink(url)}
                        className="px-3 py-1 rounded-sm bg-blue-600 text-sm text-white
                       hover:bg-blue-700"
                    >
                        Set
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const QuoteButton = () => {
    const { editor } = useEditorStore();

    return (
        <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                editor?.isActive("blockquote") && "bg-neutral-200/80"
            )}
        >
            <MessageSquareQuote className="size-5" strokeWidth={1.5} />
        </button>
    )
}

const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        { label: "Arial", value: "Arial, sans-serif" },
        { label: "Courier New", value: 'Courier New' },
        { label: "Georgia", value: "Georgia, serif" },
        { label: "Times New Roman", value: 'Times New Roman' },
        { label: "Verdana", value: "Verdana" }
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='h-7 w-[100px] flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm'>
                    <span className='truncate'>
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                    </span>
                    <ChevronDownIcon className='ml-2 size-4 shrink-0' />

                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-1 flex flex-col gap-y-1'>
                {fonts.map((font) => (
                    <button
                        onClick={() => {
                            editor?.chain().focus().setFontFamily(font.value).run();
                        }}
                        key={font.value}
                        className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            editor?.getAttributes("textStyle").fontFamily === font.value && "bg-neutral-200/80"
                        )}
                        style={{ fontFamily: font.value }}
                    >
                        <span className='text-sm'>{font.label}</span>
                    </button>
                ))}


            </DropdownMenuContent>

        </DropdownMenu>
    )
}

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon

}: ToolbarButtonProps) => {
    return (
        <button onClick={onClick} className={cn("text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80", isActive && "bg-neutral-200/80")}>
            <Icon className='size-4' />

        </button>
    )
}

function Toolbar() {

    const { editor } = useEditorStore();

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
            [
                {
                    label: "Undo",
                    icon: Undo,
                    onClick: () => editor?.chain().focus().undo().run(),
                },
                {
                    label: "Redo",
                    icon: Redo,
                    onClick: () => editor?.chain().focus().redo().run(),
                }
            ],
            [
                {
                    label: "Bold",
                    icon: Bold,
                    isActive: editor?.isActive("bold"),
                    onClick: () => editor?.chain().focus().toggleBold().run(),
                },
                {
                    label: "Italic",
                    icon: Italic,
                    isActive: editor?.isActive("italic"),
                    onClick: () => editor?.chain().focus().toggleItalic().run(),
                },
                {
                    label: "Strikethrough",
                    icon: Strikethrough,
                    isActive: editor?.isActive("strike"),
                    onClick: () => editor?.chain().focus().toggleStrike().run(),
                },
                {
                    label: "Code",
                    icon: Code,
                    isActive: editor?.isActive("code"),
                    onClick: () => editor?.chain().focus().toggleCode().run(),
                }


            ],
            [
                {
                    label: "Bulleted List",
                    icon: List,
                    isActive: editor?.isActive("bulletList"),
                    onClick: () => editor?.chain().focus().toggleBulletList().run(),
                },
                {
                    label: "Numbered List",
                    icon: ListOrdered,
                    isActive: editor?.isActive("orderedList"),
                    onClick: () => editor?.chain().focus().toggleOrderedList().run(),
                },
                {
                    label: "Task List",
                    icon: ListTodo,
                    isActive: editor?.isActive("taskList"),
                    onClick: () => editor?.chain().focus().toggleTaskList().run(),
                }
            ]

        ];


    return (
        <div className='px-2.5 py-0.5 min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto border-b-2 border-black'>
            {sections[0].map(item => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
            ))}

            <div className='w-[1px] h-6 bg-gray-300' />

            <FontFamilyButton />

            <div className='w-[1px] h-6 bg-gray-300' />

            {sections[1].map(item => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
            ))}

            <div className='w-[1px] h-6 bg-gray-300' />
            <LinkButton />

            <QuoteButton />

            <ImageUploadButton />


            <div className='w-[1px] h-6 bg-gray-300' />

            {sections[2].map(item => (
                <ToolbarButton
                    key={item.label}
                    {...item} />
            ))}

             <div className='w-[1px] h-6 bg-gray-300' />

            <HeadingButton />

        </div>
    )
}

export default Toolbar