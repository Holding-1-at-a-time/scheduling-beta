import { query } from './_generated/server'
import { v } from 'convex/values'

export const getServicePopularity = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = args
    
    const services = await ctx.db
      .query('services')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect()

    const appointments = await ctx.db
      .query('appointments')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect()

    const servicePopularity = services.map(service => ({
      serviceName: service.name,
      count: appointments.filter(apt => apt.serviceId === service._id).length
    }))

    return servicePopularity
  },
})

export const getRevenueData = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = args
    
    const appointments = await ctx.db
      .query('appointments')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect()

    const revenueData = appointments.reduce((acc, apt) => {
      const date = new Date(apt.date).toISOString().split('T')[0]
<<<<<<< HEAD
      acc[date] = (acc[date] || 0) + apt.revenue
=======
      acc[date] = (acc[date] || 0)  apt.revenue
>>>>>>> development
      return acc
    }, {} as Record<string, number>)

    return Object.entries(revenueData).map(([date, revenue]) => ({ date, revenue }))
  },
})

export const getCustomerRetention = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = args
    
    const customers = await ctx.db
      .query('customers')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect()

    const appointments = await ctx.db
      .query('appointments')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect()

    const customerRetention = customers.reduce((acc, customer) => {
      const customerAppointments = appointments.filter(apt => apt.customerId === customer._id)
      if (customerAppointments.length > 1) {
        const lastAppointmentDate = new Date(Math.max(...customerAppointments.map(apt => new Date(apt.date).getTime())))
        const date = lastAppointmentDate.toISOString().split('T')[0]
<<<<<<< HEAD
        acc[date] = (acc[date] || 0) + 1
=======
        acc[date] = (acc[date] || 0)  1
>>>>>>> development
      }
      return acc
    }, {} as Record<string, number>)

    const totalCustomers = customers.length

    return Object.entries(customerRetention).map(([date, count]) => ({
      date,
      retentionRate: count / totalCustomers
    }))
  },
})