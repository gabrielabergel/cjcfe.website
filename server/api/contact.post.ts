export default defineEventHandler(async (event) => {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API_URL is missing.',
    })
  }

  const body = await readBody(event)

  try {
    const response = await $fetch(`${apiUrl}/api/contact/submit`, {
      method: 'POST',
      body,
    })

    return response
  } catch (error: any) {
    console.error('Contact form submission failed:', error)

    if (error?.data?.status === 'error') {
      return error.data
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur est survenue lors de l'envoi.",
    })
  }
})
