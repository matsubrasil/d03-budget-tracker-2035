'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Currencies, Currency } from '@/lib/currencies'

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectOption, setSelectOption] = React.useState<Currency | null>(null)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectOption ? <>{selectOption.label}</> : <>Set currency</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <OptionList setOpen={setOpen} setSelectOption={setSelectOption} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectOption ? <>{selectOption.label}</> : <>Set currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="hidden">Set currency</DrawerTitle>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} setSelectOption={setSelectOption} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function OptionList({
  setOpen,
  setSelectOption,
}: {
  setOpen: (open: boolean) => void
  setSelectOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectOption(
                  Currencies.find((currency) => currency.value === value) ||
                    null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
