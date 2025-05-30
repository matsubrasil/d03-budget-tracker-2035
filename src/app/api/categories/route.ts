import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function GET(request: Request) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // console.log('@@@ API CATEGORY')
  const { searchParams } = new URL(request.url)
  const paramType = searchParams.get('type')

  // console.log('@@@ API CATEGORY paramType', paramType)

  const validator = z.enum(['expense', 'income']).nullable()

  const queryParams = validator.safeParse(paramType)

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    })
  }

  const type = queryParams.data

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), //include type in the filters if it's defined
    },
    orderBy: {
      name: 'asc',
    },
  })

  //console.log('@@@ API CATEGORY', categories)

  return Response.json(categories)
}
