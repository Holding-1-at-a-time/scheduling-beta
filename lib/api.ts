// lib/api.ts
interface QuoteData {
    vehicleType: string
    condition: string
    images: string[]
}

export async function processQuote(data: QuoteData): Promise<number> {
    // Simulate API call to backend for processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a random estimate between $100 and $500
    const estimate = Math.floor(Math.random() * (500 - 100 + 1) + 100)

    return estimate
}