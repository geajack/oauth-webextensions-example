const clientID = "988121232658-586ahfanse4cgjmjk6fdtvpo5glmi1ul.apps.googleusercontent.com";
const redirectURL = browser.identity.getRedirectURL();

let scopes = "https://www.googleapis.com/auth/drive.appdata";
scopes += " https://www.googleapis.com/auth/userinfo.email";
scopes += " https://www.googleapis.com/auth/userinfo.profile";

let authorizationURL = "https://accounts.google.com/o/oauth2/v2/auth";
authorizationURL += "?client_id=" + clientID;
authorizationURL += "&redirect_uri=" + encodeURIComponent(redirectURL)
authorizationURL += "&response_type=token"
authorizationURL += "&scope=" + encodeURIComponent(scopes);

let accessToken = null;

async function requestAuthorization(promptUser)
{
    try
    {
        let resultURL = await browser.identity.launchWebAuthFlow(
            {
                url: authorizationURL,
                interactive: promptUser,
            }
        );

        let rawParameters = new URL(resultURL).hash.substring(1);
        let parameters = new URLSearchParams(rawParameters);
        accessToken = parameters.get("access_token");
        
        return true;
    }
    catch
    {
        return false;
    }
}

async function initializeDrive()
{
    let url = "https://www.googleapis.com/drive/v3/files";
    url += "?access_token=" + accessToken;

    let response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    name: "message",
                    parents: ["appDataFolder"]
                }
            )
        }
    );
}

export async function isUserLoggedIn()
{
    return await requestAuthorization(false);
}

export async function logIn()
{
    return await requestAuthorization(true);
}

export async function getUserInfo()
{
    if (accessToken === null)
    {
        await requestAuthorization(false);
    }

    let response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken);
    let userInfo = await response.json();
    return userInfo;
}

export async function getData()
{
    if (accessToken === null)
    {
        await requestAuthorization(false);
    }

    let fileId;
    {
        let url = "https://www.googleapis.com/drive/v3/files";
        url += "?spaces=appDataFolder";
        url += "&access_token=" + accessToken;

        let response = await fetch(url);
        let responseJson = await response.json();
        let files = responseJson.files;

        fileId = files[0].id;

        console.log(files[0]);
    }

    {
        let url = "https://www.googleapis.com/drive/v3/files";
        url += "/" + fileId;
        url += "?alt=media";

        let response = await fetch(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            }
        );

        return await response.text();
    }    
}

export async function setData(value)
{
    if (accessToken === null)
    {
        await requestAuthorization(false);
    }

    let fileId;
    {
        let url = "https://www.googleapis.com/drive/v3/files";
        url += "?spaces=appDataFolder";
        url += "&access_token=" + accessToken;

        let response = await fetch(url);
        let responseJson = await response.json();
        let files = responseJson.files;

        fileId = files[0].id;

        console.log(files[0]);
    }

    {
        let url = "https://www.googleapis.com/upload/drive/v3/files";
        url += "/" + fileId;
        url += "?access_token=" + accessToken;
        url += "&uploadType=media";

        let response = await fetch(
            url,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: value
            }
        );

        console.log(await response.json());
    }
}