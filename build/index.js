"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSheetsEnv = void 0;
const helpers_1 = require("./helpers");
const fetchSheetsEnv = async (range, spreadsheetId, serviceAccountJson, clientId) => {
    // no client secret necessary for ios clients (see google-auth-library)
    const globalOauth2ClientSettings = { clientId: clientId, redirectUri: 'http://localhost' };
    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    const client = serviceAccountJson
        ? await helpers_1.getClientHeadless(serviceAccountJson, scopes)
        : await helpers_1.getClientLocalhost(globalOauth2ClientSettings, scopes);
    const res = await client.request({ url });
    const envObj = helpers_1.getEnv(res.data.values);
    return envObj;
};
exports.fetchSheetsEnv = fetchSheetsEnv;
