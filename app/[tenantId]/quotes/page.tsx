// app/quote/page.tsx
import QuoteForm from '@/components/quote-form'

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Get a Quote</h1>
      <QuoteForm />
    </div>
  )
}