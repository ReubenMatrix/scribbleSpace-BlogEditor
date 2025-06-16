"use client";

import React, { useRef } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { FormSchema, formSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

type Props = {}

function Page({ }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleCreatePost(values: FormSchema){
        try{
            const formData = new FormData();
            formData.append("text", values.text);

            if (values.image) {
                formData.append("image", values.image);
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const data = await response.json();
            console.log("Post created successfully:", data);

            form.reset(); 
        }catch (error) {
            console.error("Error creating post:", error);
        }
    }

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: '',
            image: null,
        },
    })

    function onSubmit(values: FormSchema) {
        handleCreatePost(values)
    }

    function handleImageUpload() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const selectedImage = form.watch("image");

    return (
        <div className='flex flex-col min-h-screen items-center justify-center'>
            <div className='flex flex-col w-[500px] bg-gray-100 border-2 border-black rounded-md p-4'>
                <div className='border-b border-gray-400 pb-3 mb-4'>
                    <h2 className='font-bold text-xl font-serif'>Create a new post</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col h-full'>
                        <div className='flex-1 mb-4'>
                            <FormField 
                                control={form.control} 
                                name="text" 
                                render={({ field }) => (
                                    <FormItem className='h-full'>
                                        <FormControl>
                                            <Textarea 
  placeholder="What's on your mind?" 
  {...field} 
  className="bg-transparent border-none shadow-none focus:ring-0 focus:outline-none focus:border-none focus:shadow-none resize-none h-[300px] p-0"  
/>

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, value, ref, ...restField } }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input
                                            ref={(e) => {
                                                ref(e);
                                                fileInputRef.current = e;
                                            }}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                onChange(file);
                                            }}
                                            {...restField}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {selectedImage && (
                            <div className="text-sm text-gray-600 p-2 bg-gray-200 rounded mb-4">
                                Selected: {selectedImage.name}
                            </div>
                        )}

                        <div className="flex gap-2 border-t border-gray-400 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleImageUpload}
                                className="flex items-center gap-2"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </Button>

                            <Button type="submit" className="flex-1">
                                Create Post
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page