// components/calendar.tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DayClickEventHandler, SelectSingleEventHandler } from "react-day-picker"
import { format, parse, startOfMonth, endOfMonth } from "date-fns"
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"

export interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  customClassNames?: {
    day?: string
    selected?: string
    today?: string
    outside?: string
    disabled?: string
  }
  onDayClick?: DayClickEventHandler
  onSelect?: SelectSingleEventHandler
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  customClassNames,
  onDayClick,
  onSelect,
  ...props
}: CalendarProps) {
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())
  const { user } = useUser()

  const events = useQuery(api.calendar.getEvents, {
    tenantId: user?.id ?? '',
    start: startOfMonth(currentMonth).toISOString(),
    end: endOfMonth(currentMonth).toISOString(),
  })

  const addEvent = useMutation(api.calendar.addEvent)

  const handleDayClick: DayClickEventHandler = (day, modifiers, e) => {
    if (onDayClick) {
      onDayClick(day, modifiers, e)
    }
  }

  const handleSelect: SelectSingleEventHandler = (day, selectedDay, modifiers, e) => {
    setSelectedDay(day)
    if (onSelect) {
      onSelect(day, selectedDay, modifiers, e)
    }
  }

  const handleAddEvent = async (date: Date) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add events",
        variant: "destructive",
      })
      return
    }

    try {
      await addEvent({
        tenantId: user.id,
        title: "New Event",
        start: date.toISOString(),
        end: date.toISOString(),
        allDay: true,
      })
      toast({
        title: "Success",
        description: "Event added successfully",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive",
      })
    }
  }

  if (events === undefined) {
    return <Spinner />
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          customClassNames?.day
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          customClassNames?.day
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          customClassNames?.selected
        ),
        day_today: cn("bg-accent text-accent-foreground", customClassNames?.today),
        day_outside: cn(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          customClassNames?.outside
        ),
        day_disabled: cn("text-muted-foreground opacity-50", customClassNames?.disabled),
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date, ...contentProps }) => (
          <div
            {...contentProps}
            onClick={() => handleAddEvent(date)}
            className="relative w-full h-full flex items-center justify-center"
          >
            {format(date, "d")}
            {events?.some(event =>
              parse(event.start, 'yyyy-MM-dd', new Date()).getTime() === date.getTime()
            ) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
          </div>
        ),
      }}
      onDayClick={handleDayClick}
      selected={selectedDay}
      onSelect={handleSelect}
      onMonthChange={setCurrentMonth}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }