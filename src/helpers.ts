import { JWT, OAuth2Client } from 'google-auth-library'
import { createServer } from 'http'
import * as open from 'open'

export const get_client_headless = async (
    service_account_json: { client_email: string; private_key: string },
    scopes
) => {
    const client = new JWT({
        email: service_account_json.client_email,
        key: service_account_json.private_key,
        scopes,
    })
    return client
}

export const get_client_localhost = async (globalOauth2ClientSettings, scopes) => {
    const globalOAuth2Client = new OAuth2Client(globalOauth2ClientSettings)
    const oAuth2ClientAuthUrlOptions = { access_type: 'offline', scope: scopes }

    const nic = await authorizeWithLocalhost(globalOauth2ClientSettings, oAuth2ClientAuthUrlOptions)

    globalOAuth2Client.setCredentials(nic)

    const client = globalOAuth2Client
    return client
}

export const get_env = gapi_response => {
    const values = gapi_response
        .filter(el => el[0]?.length > 0)
        .reduce((acc, val) => {
            acc[val[0]] = val[1]
            return acc
        }, {})

    return values
}

export const authorizeWithLocalhost = async (oAuth2ClientOptions, oAuth2ClientAuthUrlOptions) => {
    // Wait until the server is listening, otherwise we don't have
    // the server port needed to set up the Oauth2Client.
    const server: any = await new Promise(resolve => {
        const s = createServer()
        s.listen(0, () => resolve(s))
    })
    const { port } = server.address()
    const client = new OAuth2Client({
        ...oAuth2ClientOptions,
        redirectUri: `http://localhost:${port}`,
    })

    const authCode: any = await new Promise(async (resolve, reject) => {
        server.on('request', (request, response) => {
            const urlParts = new URL(request.url ?? '', 'http://localhost').searchParams
            const code = urlParts.get('code')
            const error = urlParts.get('error')
            if (code) {
                resolve(code)
            } else {
                reject(error)
            }

            response.end('Success, you may now close this page!')
        })
        const authUrl = client.generateAuthUrl(oAuth2ClientAuthUrlOptions)
        console.log(authUrl)
        open(authUrl)
    })
    server.close()

    return (await client.getToken(authCode)).tokens
}
