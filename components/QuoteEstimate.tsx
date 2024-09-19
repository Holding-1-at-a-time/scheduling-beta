// components/quote-estimate.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
<<<<<<< HEAD

interface QuoteEstimateProps {
    estimate: number
}

export default function QuoteEstimate({ estimate }: QuoteEstimateProps) {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Quote Estimate</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">${estimate.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">
                    This is an estimate based on the information provided. The final price may vary depending on additional factors.
                </p>
            </CardContent>
        </Card>
=======
import { motion } from 'framer-motion'

interface QuoteEstimateProps {
    estimate: number
    currency?: string
    confidence: 'low' | 'medium' | 'high'
}

export default function QuoteEstimate({ estimate, currency = 'USD', confidence }: QuoteEstimateProps) {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
    }

    const getConfidenceColor = (): string => {
        switch (confidence) {
            case 'low':
                return 'text-yellow-500'
            case 'medium':
                return 'text-blue-500'
            case 'high':
                return 'text-green-500'
            default:
                return 'text-gray-500'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Quote Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(estimate)}</p>
                    <p className={`text-sm ${getConfidenceColor()} font-semibold mt-2`}>
                        Confidence: {confidence.charAt(0).toUpperCase()  confidence.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        This is an estimate based on the information provided. The final price may vary depending on additional factors.
                    </p>
                </CardContent>
            </Card>
        </motion.div>
>>>>>>> development
    )
}