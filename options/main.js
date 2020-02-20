const clientID = "988121232658-ib7a5b3eu5j5eq0ca7mbn6c3rld5m99l.apps.googleusercontent.com";
const clientSecret = "TmtljFJguO98j4si2LIQMR15";

async function getAccessToken(storageKey)
{
    var { refreshToken } = await browser.storage.local.get(storageKey);
    var accessToken;

    if (!refreshToken)
    {
        const redirectURL = "https://87dc662381fddaa0fac473c102b78da4b346adea.extensions.allizom.org/";
        const scope = "https://www.googleapis.com/auth/drive.metadata.readonly";

        let url = "https://accounts.google.com/o/oauth2/auth";
        url += "?response_type=code"
        url += "&access_type=offline";
        url += "&client_id=" + clientID;
        url += "&redirect_uri=" + encodeURIComponent(redirectURL)
        url += "&scope=" + encodeURIComponent(scope);
        let resultURL = await browser.identity.launchWebAuthFlow(
            {
                url: url,
                interactive: true,
            }
        );
        let authCode = new URL(resultURL).searchParams.get("code");

        let response = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        code: authCode,
                        client_id: clientID,
                        client_secret: clientSecret,
                        redirect_uri: redirectURL,
                        grant_type: "authorization_code"
                    }
                )
            }
        );
        let responseJSON = await response.json();
        accessToken = responseJSON["access_token"];
        let refreshToken = responseJSON["refresh_token"];
    }
    else
    {
        let response = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        refresh_token: refreshToken,
                        client_id: clientID,
                        client_secret: clientSecret,
                        grant_type: "refresh_token"
                    }
                )
            }
        );
        let responseJSON = await response.json();

        accessToken = responseJSON["access_token"];
    }

    return accessToken;
}

async function main()
{
    let accessToken = await getAccessToken("refreshToken");
    let response = await fetch("https://www.googleapis.com/drive/v3/files?access_token=" + accessToken);
    let json = await response.json();
    for (let file of json.files)
    {
        console.log(file.name);
    }
}

main();