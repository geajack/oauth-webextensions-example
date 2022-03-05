const clientID = "988121232658-586ahfanse4cgjmjk6fdtvpo5glmi1ul.apps.googleusercontent.com";
                //988121232658-ib7a5b3eu5j5eq0ca7mbn6c3rld5m99l.apps.googleusercontent.com
                //988121232658-d2hgjbmhuk4hbkhsft8o1pm1jiqsqij9.apps.googleusercontent.com
const clientSecret = "TmtljFJguO98j4si2LIQMR15";

async function getAccessToken(storageKey)
{
    var { refreshToken } = await browser.storage.local.get(storageKey);
    var accessToken;

    if (true)
    {
        const redirectURL = browser.identity.getRedirectURL();
        // https://87dc662381fddaa0fac473c102b78da4b346adea.extensions.allizom.org/
        const scope = "https://www.googleapis.com/auth/drive";

        console.log("Redirect URL: ", redirectURL);

        let url = "https://accounts.google.com/o/oauth2/v2/auth";
        url += "?client_id=" + clientID;
        url += "&redirect_uri=" + encodeURIComponent(redirectURL)
        url += "&response_type=token"
        url += "&scope=" + encodeURIComponent(scope);

        let resultURL = await browser.identity.launchWebAuthFlow(
            {
                url: url,
                interactive: true,
            }
        );
        console.log("Got response URL: ");
        console.log(resultURL);

        let rawParameters = new URL(resultURL).hash.substring(1)
        let parameters = new URLSearchParams(rawParameters);
        let expiresIn = parameters.get("expires_in");
        console.log("Got access token, expires in " + expiresIn + " seconds");
        accessToken = parameters.get("access_token");

        // let response = await fetch(
        //     "https://oauth2.googleapis.com/token",
        //     {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(
        //             {
        //                 code: authCode,
        //                 client_id: clientID,
        //                 client_secret: clientSecret,
        //                 redirect_uri: redirectURL,
        //                 grant_type: "authorization_code"
        //             }
        //         )
        //     }
        // );
        // let responseJSON = await response.json();
        // accessToken = responseJSON["access_token"];
        // let refreshToken = responseJSON["refresh_token"];
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

    console.log("Access token is " + accessToken);
    let response = await fetch("https://www.googleapis.com/drive/v3/files?access_token=" + accessToken);
    let json = await response.json();
    console.log("Got " + json.files.length + " files.");
}

main();