import { JWT, OAuth2Client } from 'google-auth-library';
export declare const getClientHeadless: (serviceAccountJson: {
    client_email: string;
    private_key: string;
}, scopes: any) => Promise<JWT>;
export declare const getClientLocalhost: (globalOauth2ClientSettings: any, scopes: any) => Promise<OAuth2Client>;
export declare const getEnv: (gapiResponse: any) => any;
export declare const authorizeWithLocalhost: (oAuth2ClientOptions: any, oAuth2ClientAuthUrlOptions: any) => Promise<import("google-auth-library").Credentials>;
