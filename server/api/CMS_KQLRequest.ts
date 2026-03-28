export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const email = config.apiAuthEmail
    const password = config.apiAuthPassword
    const apiUrl = config.apiUrl

    const authHeader = Buffer.from(`${email}:${password}`).toString('base64')

    const body = await readBody(event)
    console.log('KQL Request body:', JSON.stringify(body, null, 2))
    console.log('API URL:', apiUrl)

    const dataApi = await $fetch(`${apiUrl}/api/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`
        },
        body,
    })

    return dataApi
})


