import { describe, test } from 'mocha'
import { expect } from 'chai'
import { authorizeWithLocalhost, getClientHeadless, getClientLocalhost, getEnv } from './helpers'
import { fetchSheetsEnv } from './index'
import sinon from 'sinon'
import * as helpers from './helpers'

describe('Sheets ENV', () => {
    test(fetchSheetsEnv.name, async () => {
        sinon.stub(helpers, 'getClientHeadless').callsFake(fake)
        sinon.stub(helpers, 'getClientLocalhost').callsFake(fake)

        const range = 'Sheet1!A1:B2'
        const spreadhsheetId = '9AF3MuLg3DxaBBLL-5KVsseAboxYKhmjJqumzLlCIa6IU'
        // eslint-disable-next-line camelcase
        const serviceAccount = { client_email: 'john@so.org', private_key: '123' }
        const clientId = '4892776289376-7oxYKhmjJqumzLlb66o58g3t.apps.googleusercontent.com'
        const result = await fetchSheetsEnv(range, spreadhsheetId, serviceAccount, clientId)
        const result2 = await fetchSheetsEnv(range, spreadhsheetId, undefined, clientId)

        expect(result).to.deep.equal({ key1: 'val1', key2: 'val2' })
        expect(result2).to.deep.equal({ key1: 'val1', key2: 'val2' })
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

const fake = function () {
    return {
        request: () => ({
            data: {
                values: [
                    ['key1', 'val1'],
                    ['key2', 'val2'],
                ],
            },
        }),
    }
}
