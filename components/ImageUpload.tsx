// components/image-upload.tsx
'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getURL } from 'next/dist/shared/lib/utils'

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    onRemove: (value: string) => void
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 5,
        onDrop: async (acceptedFiles) => {
            setIsUploading(true)
            setError(null)
            try {
                const uploadedUrls = await Promise.all(
                    acceptedFiles.map(async (file) => {
                        const storageId = await uploadFile(file)
                        return await getURL(storageId)
                    })
                )
                onChange([...value, ...uploadedUrls])
            } catch (error) {
                console.error('Error uploading images:', error)
                setError('Failed to upload images. Please try again.')
            } finally {
                setIsUploading(false)
            }
        }
    })

    return (
        <div>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some images here, or click to select images</p>
            </div>
            {isUploading && <p className="mt-2">Uploading...</p>}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square">
                        <Image
                            fill
                            src={url}
                            alt="Uploaded image"
                            className="object-cover rounded-md"
                        />
                        <Button
                            type="button"
                            onClick={() => onRemove(url)}
                            className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
                            size="icon"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}