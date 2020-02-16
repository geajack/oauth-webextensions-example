async function main()
{
    const clientID = "988121232658-ib7a5b3eu5j5eq0ca7mbn6c3rld5m99l.apps.googleusercontent.com";
    const redirectURL = "https://87dc662381fddaa0fac473c102b78da4b346adea.extensions.allizom.org/";
    const scope = "https://www.googleapis.com/auth/drive.metadata.readonly";

    var url = "https://accounts.google.com/o/oauth2/auth?";
    url += "response_type=token"
    url += "&client_id=" + clientID;
    url += "&redirect_uri=" + encodeURIComponent(redirectURL)
    url += "&scope=" + encodeURIComponent(scope);

    var resultURL = await browser.identity.launchWebAuthFlow(
        {
            url: url,
            interactive: true,
        }
    );
    let components = new URL(resultURL).hash.substring(1).split("&");
    let accessToken = null;
    for (let component of components)
    {
        let [name, value] = component.split("=");
        if (name === "access_token")
        {
            accessToken = value;
        }
    }

    let response = await fetch("https://www.googleapis.com/drive/v3/files?access_token=" + accessToken);
    let json = await response.json();
    for (let file of json.files)
    {
        console.log(file.name);
    }
}

main();