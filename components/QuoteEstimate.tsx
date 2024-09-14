// components/quote-estimate.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    )
}