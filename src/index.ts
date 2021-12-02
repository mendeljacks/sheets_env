import { getClientHeadless, getClientLocalhost, getEnv } from './helpers'

export const fetchSheetsEnv = async (
    range: string,
    spreadsheetId: string,
    serviceAccountJson: { client_email: string; private_key: string },
    clientId: string
) => {
    // no client secret necessary for ios clients (see google-auth-library)
    const globalOauth2ClientSettings = { clientId: clientId, redirectUri: 'http://localhost' }
                              const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`

    const client = serviceAccountJson
        ? await getClientHeadless(serviceAccountJson, scopes)
        : await getClientLocalhost(globalOauth2ClientSettings, scopes)

    const res: any = await client.request({ url })

    const envObj = getEnv(res.data.values)

    return envObj
}
