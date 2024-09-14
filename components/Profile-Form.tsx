// components/profile-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { useUser } from '@clerk/nextjs'

const profileSchema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email address'),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm() {
    const { toast } = useToast()
    const { user } = useUser()
    const tenantId = user?.id

    const profile = useQuery(api.profile.get, tenantId ? { tenantId } : 'skip')
    const updateProfile = useMutation(api.profile.update)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            businessName: '',
            description: '',
            phone: '',
            email: '',
            website: '',
        },
    })

    useEffect(() => {
        if (profile) {
            form.reset(profile)
        }
    }, [profile, form])

    const onSubmit = async (data: ProfileFormData) => {
        if (!tenantId) {
            toast({
                title: 'Error',
                description: 'You must be logged in to update your profile.',
                variant: 'destructive',
            })
            return
        }

        setIsSubmitting(true)
        try {
            await updateProfile({ ...data, tenantId })
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
            })
        } catch (error) {
            console.error('Error updating profile:', error)
            toast({
                title: 'Update Failed',
                description: 'There was an error updating your profile. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!tenantId) {
        return <div>Please sign in to update your profile.</div>
    }

    if (profile === undefined) {
        return <Spinner />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                                <Input {...field} type="url" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner className="mr-2" /> : null}
                    Update Profile
                </Button>
            </form>
        </Form>
    )
}