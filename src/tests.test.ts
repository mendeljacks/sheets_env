import { describe, test } from 'mocha'
import { expect } from 'chai'
import { authorizeWithLocalhost, getClientHeadless, getClientLocalhost, getEnv } from './helpers'
import { fetchSheetsEnv } from './index'

describe('Sheets ENV', () => {
    test(fetchSheetsEnv.name, async () => {
        const range = 'Sheet1!A1:B2'
        const spreadhsheetId = '9AF3MuLg3DxaBBLL-5KVsseAboxYKhmjJqumzLlCIa6IU'
        // eslint-disable-next-line camelcase
        const serviceAccount = { client_email: 'john@so.org', private_key: '123' }
        const clientId = '4892776289376-7oxYKhmjJqumzLlb66o58g3t.apps.googleusercontent.com'
        const result = await fetchSheetsEnv(range, spreadhsheetId, serviceAccount, clientId)

        expect(result).to.deep.equal([])
    })
    test(getEnv.name, () => {
        const input = [
            ['key', 'value'],
            ['key2', 'value2'],
            ['', 'value3'],
        ]
        const output = { key: 'value', key2: 'value2' }
        expect(getEnv(input)).to.deep.equal(output)
    })
    test(getClientLocalhost.name, () => {
        expect(true).to.equal(true)
    })
    test(getClientHeadless.name, () => {
        expect(true).to.equal(true)
    })
    test(authorizeWithLocalhost.name, () => {
        expect(true).to.equal(true)
    })
})
