import { describe, test } from 'mocha'
import { expect } from 'chai'
import {
    authorizeWithLocalhost,
    get_client_headless,
    get_client_localhost,
    get_env,
} from './helpers'
import { download_env } from './index'

describe('Sheets ENV', () => {
    test(download_env.name, async () => {
        const range = 'Sheet1!A1:B2'
        const spreadhsheet_id = '9AF3MuLg3DxaBBLL-5KVsseAboxYKhmjJqumzLlCIa6IU'
        const service_account = {
            client_email: 'john@so.org',
            private_key: '123',
        }
        const clientId = '4892776289376-7oxYKhmjJqumzLlb66o58g3t.apps.googleusercontent.com'
        const result = await download_env(range, spreadhsheet_id, service_account, clientId)

        expect(result).to.deep.equal([])
    })
    test(get_env.name, () => {
        const input = [
            ['key', 'value'],
            ['key2', 'value2'],
            ['', 'value3'],
        ]
        const output = { key: 'value', key2: 'value2' }
        expect(get_env(input)).to.deep.equal(output)
    })
    test(get_client_localhost.name, () => {
        expect(true).to.equal(true)
    })
    test(get_client_headless.name, () => {
        expect(true).to.equal(true)
    })
    test(authorizeWithLocalhost.name, () => {
        expect(true).to.equal(true)
    })
})
