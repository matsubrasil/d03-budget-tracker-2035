'use server'

import { currentUser } from '@clerk/nextjs/server'
import { UpdateUserCurrencySchema } from '@/schema/userSettings'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export async function UpdateUserCurrency(currency: string) {
  const parseBody = UpdateUserCurrencySchema.safeParse({
    currency,
  })

  if (!parseBody.success) {
    throw parseBody.error
  }

  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  })

  return userSettings
}
