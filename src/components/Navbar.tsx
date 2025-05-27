'use client'
import { Logo, LogoMobile } from '@/components/Logo'
import { ThemeSwitcherBtn } from '@/components/ThemeSwitcherBtn'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'Manage', link: '/manage' },
]

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <SheetTitle className="hidden">Menu</SheetTitle>
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="h-[80px] min-h-[60px] flex items-center gap-x-4 grow-1">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8 mx-auto">
        <div className="flex items-center gap-x-4 h-[80px] min-h-[60px]">
          <Logo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string
  label: string
  clickCallback?: () => void | undefined
}) {
  const pathname = usePathname()
  const isActive = pathname === link
  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: 'ghost',
          }),
          'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
          isActive && 'text-foreground'
        )}
        onClick={() => {
          if (clickCallback) clickCallback()
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] hidden h-[2px] w-[80%] rounded-xl bg-foreground left-1/2 -translate-x-1/2 md:block" />
      )}
    </div>
  )
}

export default Navbar
