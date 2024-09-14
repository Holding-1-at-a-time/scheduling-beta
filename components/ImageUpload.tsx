// components/image-upload.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'

interface ImageUploadProps {
    onChange: (value: string[]) => void
    onRemove: (value: string) => void
}

export default function ImageUpload({ onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const getUploadUrl = useMutation(api.images.getUploadUrl)
    const saveImageUrl = useMutation(api.images.saveImageUrl)
    const deleteImage = useMutation(api.images.deleteImage)
    const images = useQuery(api.images.getImages)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsUploading(true)
        try {
            const uploadedUrls = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const { uploadUrl, storageId } = await getUploadUrl({ contentType: file.type })
                    await fetch(uploadUrl, {
                        method: 'PUT',
                        body: file,
                        headers: { 'Content-Type': file.type },
                    })
                    const { url } = await saveImageUrl({ storageId })
                    return url
                })
            )
            onChange([...(images?.map(img => img.url) ?? []), ...uploadedUrls])
            toast({ title: "Images uploaded successfully" })
        } catch (error) {
            console.error('Error uploading images:', error)
            toast({ title: "Failed to upload images", variant: "destructive" })
        } finally {
            setIsUploading(false)
        }
    }, [getUploadUrl, saveImageUrl, onChange, images])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 5,
        onDrop
    })

    const handleRemove = async (url: string) => {
        const image = images?.find(img => img.url === url)
        if (image) {
            try {
                await deleteImage({ storageId: image.storageId })
                onRemove(url)
                toast({ title: "Image removed successfully" })
            } catch (error) {
                console.error('Error removing image:', error)
                toast({ title: "Failed to remove image", variant: "destructive" })
            }
        }
    }

    return (
        <div>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag 'n' drop some images here, or click to select images</p>
            </div>
            {isUploading && <Spinner className="mt-2" />}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images?.map((image) => (
                    <div key={image._id} className="relative aspect-square">
                        <Image
                            fill
                            src={image.url}
                            alt="Uploaded image"
                            className="object-cover rounded-md"
                        />
                        <Button
                            type="button"
                            onClick={() => handleRemove(image.url)}
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