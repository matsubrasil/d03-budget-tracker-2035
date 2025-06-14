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
import { useMutation, useQuery } from '@tanstack/react-query'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { UserSettings } from '@/generated/prisma'
import { UpdateUserCurrency } from '@/app/wizard/_actions/userSettings'
import { toast } from 'sonner'

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  )

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
  })

  React.useEffect(() => {
    if (!userSettings.data) {
      return
    }

    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    )

    if (userCurrency) {
      setSelectedOption(userCurrency)
    }
  }, [userSettings.data])

  // mutations are typically used to create/update/delete data or perform server side-effects
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successfully 🍕`, {
        id: 'update-currency',
      })

      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      )
    },
    onError: (e) => {
      toast.error('Something went wrong', {
        id: 'update-currency',
      })
    },
  })

  const selectOptions = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency')
        return
      }
      toast.loading('Updating currency...', {
        id: 'update-currency',
      })

      mutation.mutate(currency.value)
    },
    [mutation]
  )

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectOption={selectOptions} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="hidden">Set currency</DrawerTitle>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectOption={selectOptions} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
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
