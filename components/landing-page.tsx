// components/landing-page.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Users, Lock, BarChart, MessageSquare, Zap, RefreshCw, Layers, Shield, Check, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const features = [
  { id: 'scheduling', icon: Calendar, title: 'AI-Powered Scheduling', description: 'Optimize appointments with machine learning' },
  { id: 'customer', icon: Users, title: 'Customer Management', description: 'Securely store and manage customer data' },
  { id: 'notifications', icon: MessageSquare, title: 'Smart Notifications', description: 'Automated, multi-channel reminders' },
  { id: 'integration', icon: RefreshCw, title: 'Calendar Syncing', description: 'Seamless integration with popular calendars' },
  { id: 'analytics', icon: BarChart, title: 'Analytics Dashboard', description: 'Actionable insights for your business' },
  { id: 'security', icon: Shield, title: 'Enterprise-Grade Security', description: 'Protect your data with advanced encryption' },
]

const pricingTiers = [
  {
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: 'Perfect for independent detailers',
    features: ['Up to 100 appointments/month', 'Basic AI scheduling', 'Email support', 'Customer management'],
  },
  {
    name: 'Pro',
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: 'Ideal for growing detailing businesses',
    features: ['Unlimited appointments', 'Advanced AI scheduling', 'Priority support', 'Team management', 'Custom branding'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    description: 'For large-scale detailing operations',
    features: ['All Pro features', 'Dedicated account manager', 'API access', 'Advanced analytics', 'Custom integrations'],
  },
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  business: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  size: z.enum(["solo", "small", "medium", "large"], {
    required_error: "Please select a business size.",
  }),
  interests: z.enum(["scheduling", "customer", "notifications", "integration", "analytics", "security"], {
    required_error: "Please select your primary interest.",
  }),
  message: z.string().optional(),
  terms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export function LandingPageComponent() {
  const [activeFeature, setActiveFeature] = useState('scheduling')
  const [isAnnualBilling, setIsAnnualBilling] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      business: "",
      size: "solo",
      interests: "scheduling",
      message: "",
      terms: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send this data to your backend
    console.log(values)
    toast({
      title: "Submission Received",
      description: "Thank you for your interest! We'll be in touch soon.",
    })
    setIsSignUpOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Clock className="h-8 w-8 text-[#00AE98]" />
          <span className="ml-2 text-2xl font-bold text-white">DetailSync</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {['Features', 'Analytics', 'Pricing', 'Contact'].map((item) => (
            <Link key={item} className="text-sm font-medium hover:text-[#00AE98] transition-colors" href={`#${item.toLowerCase()}`}>
              {item}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 pt-16">
        <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity, scale }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00AE98] to-blue-600 opacity-30" />
            <img
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                  Revolutionize Your Detailing Business
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed">
                  AI-Powered Scheduling for the Modern Detailer
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsSignUpOpen(true)}
                  className="bg-[#00AE98] text-white hover:bg-[#009B86] transition-colors"
                >
                  Join the Waitlist
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-[#00AE98]">Cutting-Edge Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-gray-900 border-gray-800 h-full transition-all hover:shadow-lg hover:shadow-[#00AE98]/20 hover:border-[#00AE98]">
                    <CardHeader>
                      <feature.icon className="w-10 h-10 mb-2 text-[#00AE98]" />
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="text-[#00AE98] p-0" onClick={() => setActiveFeature(feature.id)}>
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="analytics" className="w-full py-24 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-[#00AE98]">
                  Powerful Analytics Dashboard
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Gain actionable insights to optimize your detailing business with our comprehensive analytics suite.
                </p>
                <ul className="space-y-4">
                  {[
                    'Track appointment trends and peak booking times',
                    'Monitor customer retention rates',
                    'Analyze no-show data to minimize losses',
                    'Identify your most popular services',
                    'Forecast demand to optimize staffing',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center space-x-2 text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ChevronRight className="h-5 w-5 text-[#00AE98]" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AE98] to-blue-500 rounded-lg transform rotate-3"></div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Analytics Dashboard"
                  className="relative z-10 rounded-lg shadow-xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-24 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-[#00AE98]">Flexible Pricing Plans</h2>
            <div className="flex justify-center items-center mb-8 space-x-4">
              <span className={`text-sm ${!isAnnualBilling ? 'text-[#00AE98]' : 'text-gray-400'}`}>Monthly</span>
              <Switch
                checked={isAnnualBilling}
                onCheckedChange={setIsAnnualBilling}
                className="bg-[#00AE98]"
              />
              <span className={`text-sm ${isAnnualBilling ? 'text-[#00AE98]' : 'text-gray-400'}`}>Annual (Save 20%)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`bg-gray-900 border-gray-800 ${index === 1 ? 'border-[#00AE98] shadow-lg shadow-[#00AE98]/20' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white mb-4">
                      ${isAnnualBilling ? tier.yearlyPrice / 12 : tier.monthlyPrice}
                      <span className="text-sm font-normal text-gray-400">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <Check className="mr-2 h-4 w-4 text-[#00AE98]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-[#00AE98] hover:bg-[#009B86] text-white" onClick={() => setIsSignUpOpen(true)}>
                      Join Waitlist
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">
              * Prices and features are tentative and subject to change based on feedback and market conditions.
            </p>
          </div>
        </section>

        <section className="w-full py-24 bg-gradient-to-r from-[#00AE98] to-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Transform Your Detailing Business?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl/relaxed lg:text-2xl/relaxed">
                  Join the waitlist for DetailSync and be the first to revolutionize your operations.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" onClick={() => setIsSignUpOpen(true)} className="bg-white text-[#00AE98] hover:bg-gray-100 transition-colors">
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 px-4 md:px-6 border-t border-gray-800">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2023 DetailSync. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            {['Terms of Service', 'Privacy Policy', 'Contact Us'].map((item) => (
              <Link key={item} className="text-xs hover:text-[#00AE98] transition-colors" href="#">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00AE98]">Join the DetailSync Waitlist</DialogTitle>
            <DialogDescription className="text-gray-300">
              Be among the first to access our AI-powered platform when it launches. Your input will help shape the future of DetailSync.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 text-white border-gray-600" />
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
                      <Input {...field} type="email" className="bg-gray-700 text-white border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-700 text-white border-gray-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select business size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 text-white">
                        <SelectItem value="solo">Solo Detailer</SelectItem>
                        <SelectItem value="small">Small Team (2-5)</SelectItem>
                        <SelectItem value="medium">Medium (6-20)</SelectItem>
                        <SelectItem value="large">Large (21+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Most Interested Feature</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select primary interest" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 text-white">
                        {features.map(feature => (
                          <SelectItem key={feature.id} value={feature.id}>{feature.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about your current challenges or what you're looking for in a scheduling solution."
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <Link href="#" className="text-[#00AE98] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#00AE98] hover:underline">Privacy Policy</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#00AE98] hover:bg-[#009B86] text-white">Join Waitlist</Button>
            </form>
          </Form>
          <p className="text-xs text-gray-400 mt-4">
            We respect your privacy and will never share your information with third parties. You can unsubscribe at any time.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}