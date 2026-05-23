import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'
import { presentationIdInputSchema } from '../types/schemas'
import { authMiddleware } from '#/middleware/auth'

export const getPresentationWithSlides = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))

  // Middleware runs before handler
  // Used for authentication / authorization
  .middleware([authMiddleware])

  .handler(async ({ data, context }) => {

    // Get logged in user id from session
    const userId = context?.session?.user?.id

    // Find presentation with matching id and userId
    const row = await prisma.presentation.findFirst({
      where: {
        id: data.id,
        userId,
      },

      // Include all slides related to presentation
      include: {
        slides: {

          // Sort slides in ascending order
          orderBy: { order: 'asc' },
        },
      },
    })


    return row;
  })