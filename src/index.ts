const { google } = require('googleapis')
const {
	globalOauth2ClientSettings,
	authorizeWithoutLocalhost,
	authorizeWithLocalhost
} = require('../helpers/google_auth')
const fs = require('fs')
const { compose, isEmpty, map, pluck, pathOr, filter, reduce } = require('ramda')
const { OAuth2Client, auth, JWT } = require('google-auth-library')
const { save_json_to_disk } = require('../helpers/json_to_disk')
const makeFolder = dir => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
}
const globalOAuth2Client = new OAuth2Client(globalOauth2ClientSettings)
const scopes = [
	'https://www.googleapis.com/auth/spreadsheets.readonly'
]
const oAuth2ClientAuthUrlOptions = { access_type: 'offline', scope: scopes }
const get_env = (range_index, gapi_response) => {
	const values = compose(
		reduce((acc, val) => {
			acc[val[0]] = val[1]
			return acc
		}, {}),
		filter(el => !isEmpty(el[0] || '')),
		// map(([a, b]) => [a.formattedValue, b.formattedValue]),
		// pluck('values'),
		// pathOr([], ['data', 'sheets', range_index, 'data', 0, 'rowData'])
	)(gapi_response)

	return values
}

const get_client = async (service_account_json) => {
	if (service_account_json) {
		// Scenario 1 there is a github with a service account
		const auth_instance = auth.fromJSON(service_account_json)
		const client = new JWT({
			email: service_account_json.client_email,
			key: service_account_json.private_key,
			scopes,
		});
		return client
	} else {
		// Scenario 2 there is a localhost browser
		const nic = await authorizeWithLocalhost(globalOauth2ClientSettings, oAuth2ClientAuthUrlOptions) // Locally an oath prompt will launch
			.catch(err => {
				debugger
				return {}
			})

		globalOAuth2Client.setCredentials(nic)

		const client = globalOAuth2Client
		return client
	}
}

export const download_env = async (project, environment, spreadsheet_id, service_account_json) => {
	const range = `${project}_${environment}!A2:B`
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${range}`;

	const client = await get_client(service_account_json)

	const res = await client.request({ url });

	const env_obj = get_env(0, res.data.values)

	makeFolder('src2/generated')
	save_json_to_disk(env_obj, `src2/generated/env_${project}_${environment.toLowerCase()}.json`)
}
