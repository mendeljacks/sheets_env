import { get_client_headless, get_client_localhost, get_env } from './helpers'

export const download_env = async (
    range: string,
    spreadsheet_id: string,
    service_account_json: {client_email: string, private_key: string},
    clientId: string
) => {
    // no client secret necessary for ios clients (see google-auth-library)
    const globalOauth2ClientSettings = { clientId: clientId, redirectUri: 'http://localhost' }
    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}`

    const client = service_account_json
        ? await get_client_headless(service_account_json, scopes)
        : await get_client_localhost(globalOauth2ClientSettings, scopes)

    const res: any = await client.request({ url })

    const env_obj = get_env(res.data.values)

    return env_obj
}
