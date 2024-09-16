import React from 'react'
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  selected: string
  onSelect: (time: string) => void
}

export function TimePicker({ selected, onSelect }: TimePickerProps) {
  const [hours, setHours] = React.useState(selected ? selected.split(':')[0] : '12')
  const [minutes, setMinutes] = React.useState(selected ? selected.split(':')[1] : '00')
  const [period, setPeriod] = React.useState(selected ? (parseInt(selected.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM')

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setHours(value)
    } else {
      const numValue = parseInt(value)
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
        setHours(value.padStart(2, '0'))
      }
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setMinutes(value)
    } else {
      const numValue = parseInt(value)
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
        setMinutes(value.padStart(2, '0'))
      }
    }
  }

  const handlePeriodChange = () => {
    setPeriod(prevPeriod => prevPeriod === 'AM' ? 'PM' : 'AM')
  }

  const handleSelect = () => {
    const formattedHours = period === 'PM' && hours !== '12' 
      ? String(parseInt(hours) + 12).padStart(2, '0')
      : (period === 'AM' && hours === '12' ? '00' : hours.padStart(2, '0'))
    onSelect(`${formattedHours}:${minutes}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selected || <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center space-x-2 p-4">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">Hours</Label>
            <Input
              id="hours"
              className="w-16 text-center"
              value={hours}
              onChange={handleHoursChange}
            />
          </div>
          <span className="text-2xl">:</span>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">Minutes</Label>
            <Input
              id="minutes"
              className="w-16 text-center"
              value={minutes}
              onChange={handleMinutesChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-xs">&nbsp;</Label>
            <Button
              variant="outline"
              className="w-14"
              onClick={handlePeriodChange}
            >
              {period}
            </Button>
          </div>
        </div>
        <div className="flex justify-end p-4 pt-0">
          <Button onClick={handleSelect}>Select</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}