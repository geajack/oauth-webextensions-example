import * as vb from "./viewbind.js";
import * as drive from "./drive.js";

class RootController
{
    initialize()
    {
        this.message.addEventListener("change", this.onChange.bind(this));
    }

    async onChange()
    {
        let value = this.message.value;
        await drive.setData(value);
    }
}

class UserInfoWidget
{
    initialize()
    {
        this.unsetUser();
    }

    unsetUser()
    {
        this.userInfo.style.display = "none";
        this.noUserMessage.style.display = "block";
    }

    setUser(user)
    {
        this.userInfo.style.display = "grid";
        this.noUserMessage.style.display = "none";
        this.email.innerText = user.email;
        this.name.innerText = user.name;
        this.avatar.src = user.picture;
    }
}

async function initialize()
{
    let controller = vb.bind(document.body, RootController, [UserInfoWidget], []);

    let userInfo = await drive.getUserInfo();

    if (! await drive.isUserLoggedIn())
    {
        await drive.logIn();
    }

    let storedData = await drive.getData();

    controller.message.value = storedData;

    controller.userInfo.setUser(userInfo);
}

initialize();