"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const helpers_1 = require("./helpers");
const index_1 = require("./index");
const sinon_1 = require("sinon");
const helpers = require("./helpers");
const secret = 'my_secret';
(0, mocha_1.describe)('Sheets ENV', () => {
    (0, mocha_1.test)(index_1.fetchSheetsEnv.name, async () => {
        sinon_1.default.stub(helpers, 'getClientHeadless').callsFake(fake);
        sinon_1.default.stub(helpers, 'getClientLocalhost').callsFake(fake);
        const range = 'Sheet1!A1:B2';
        const spreadhsheetId = '9AF3MuLg3DxaBBLL-5KVsseAboxYKhmjJqumzLlCIa6IU';
        // eslint-disable-next-line camelcase
        const serviceAccount = { client_email: 'john@so.org', private_key: '123' };
        const clientId = '4892776289376-7oxYKhmjJqumzLlb66o58g3t.apps.googleusercontent.com';
        const result = await (0, index_1.fetchSheetsEnv)(range, spreadhsheetId, serviceAccount, clientId, secret);
        const result2 = await (0, index_1.fetchSheetsEnv)(range, spreadhsheetId, undefined, clientId, secret);
        (0, chai_1.expect)(result).to.deep.equal({ key1: 'val1', key2: 'val2' });
        (0, chai_1.expect)(result2).to.deep.equal({ key1: 'val1', key2: 'val2' });
    });
    (0, mocha_1.test)(helpers_1.getEnv.name, () => {
        const input = [
            ['key', 'value'],
            ['key2', 'value2'],
            ['', 'value3'],
        ];
        const output = { key: 'value', key2: 'value2' };
        (0, chai_1.expect)((0, helpers_1.getEnv)(input)).to.deep.equal(output);
    });
    (0, mocha_1.test)(helpers_1.getClientLocalhost.name, () => {
        (0, chai_1.expect)(true).to.equal(true);
    });
    (0, mocha_1.test)(helpers_1.getClientHeadless.name, () => {
        (0, chai_1.expect)(true).to.equal(true);
    });
    (0, mocha_1.test)(helpers_1.authorizeWithLocalhost.name, () => {
        (0, chai_1.expect)(true).to.equal(true);
    });
});
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
    };
};
