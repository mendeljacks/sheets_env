## Sheets ENV
Sheets ENV is a tool to download ENV files from google sheets.

Devs will authenticate in a web browser using oauth2
CI will authenticate with service accounts stored as CI secrets
CI can also utilise the .env files created at build time

Usage instructions:

- Create credentials here so google can show the user your company name on the oauth consent screen
https://console.cloud.google.com/apis/credentials
Press create credentials -> Create OAuth client ID -> Application type iOS -> Choose a random bundleID
You should get a Client ID like this ************-****************************.apps.googleusercontent.com

- From the same credentials page also create a service account. Choose a name and click done. This will allow headless environments such as heroku/github actions to fetch the env without launching a browser and doing oauth. To get the serviceAccountJson click the newly created service account and choose keys tab click add new key JSON.

- Create a spreadsheet and share with people (keep the spreadsheetid from the url)
- Share the sheet with the service account's email address ****@oauth-123456.iam.gserviceaccount.com

- Enable google sheets api so google can bill you if you use the api too much https://console.cloud.google.com/apis/library/sheets.googleapis.com

- Have an async function that runs before anything else in your program to ensure that .env is present
```js
if (!fs.existsSync('.env')) {
    const clientId = '********-*****.apps.googleusercontent.com'
    const range = 'Sheet1!A1:B'
    const spreadsheetId = '****************'
    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT // for headless environments

    const envObj = await fetchSheetsEnv(range, spreadsheetId, serviceAccount, clientId)
    const envString = jsonToEnv(envObj)
    fs.writeFileSync('.env', envString)
}

require('dotenv').config()


export const jsonToEnv = (envObj) => Object.keys(envObj).map(key => `${key}=${envObj[key]}`).join('\n')
export const tryParse = (json) => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}
```

- JSON.stringify the service account json and put it in heroku env
- 