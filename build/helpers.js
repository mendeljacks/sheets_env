"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeWithLocalhost = exports.getEnv = exports.getClientLocalhost = exports.getClientHeadless = void 0;
const google_auth_library_1 = require("google-auth-library");
const http_1 = require("http");
const open = require("open");
const getClientHeadless = async (serviceAccountJson, scopes) => {
    const client = new google_auth_library_1.JWT({
        email: serviceAccountJson.client_email,
        key: serviceAccountJson.private_key,
        scopes,
    });
    return client;
};
exports.getClientHeadless = getClientHeadless;
const getClientLocalhost = async (globalOauth2ClientSettings, scopes) => {
    const globalOAuth2Client = new google_auth_library_1.OAuth2Client(globalOauth2ClientSettings);
    // eslint-disable-next-line camelcase
    const oAuth2ClientAuthUrlOptions = { access_type: 'offline', scope: scopes };
    const nic = await (0, exports.authorizeWithLocalhost)(globalOauth2ClientSettings, oAuth2ClientAuthUrlOptions);
    globalOAuth2Client.setCredentials(nic);
    const client = globalOAuth2Client;
    return client;
};
exports.getClientLocalhost = getClientLocalhost;
const getEnv = gapiResponse => {
    const values = gapiResponse
        .filter(el => { var _a; return ((_a = el[0]) === null || _a === void 0 ? void 0 : _a.length) > 0; })
        .reduce((acc, val) => {
        acc[val[0]] = val[1];
        return acc;
    }, {});
    return values;
};
exports.getEnv = getEnv;
const authorizeWithLocalhost = async (oAuth2ClientOptions, oAuth2ClientAuthUrlOptions) => {
    // Wait until the server is listening, otherwise we don't have
    // the server port needed to set up the Oauth2Client.
    const server = await new Promise(resolve => {
        const s = (0, http_1.createServer)();
        s.listen(0, () => resolve(s));
    });
    const { port } = server.address();
    const client = new google_auth_library_1.OAuth2Client(Object.assign(Object.assign({}, oAuth2ClientOptions), { redirectUri: `http://localhost:${port}` }));
    const authCode = await new Promise(async (resolve, reject) => {
        server.on('request', (request, response) => {
            var _a;
            const urlParts = new URL((_a = request.url) !== null && _a !== void 0 ? _a : '', 'http://localhost').searchParams;
            const code = urlParts.get('code');
            const error = urlParts.get('error');
            if (code) {
                resolve(code);
            }
            else {
                reject(error);
            }
            response.end('Success, you may now close this page!');
        });
        const authUrl = client.generateAuthUrl(oAuth2ClientAuthUrlOptions);
        console.log(authUrl);
        open(authUrl);
    });
    server.close();
    return (await client.getToken(authCode)).tokens;
};
exports.authorizeWithLocalhost = authorizeWithLocalhost;
