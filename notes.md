1. Wait until we know if we're logged in or not.
    - If not, display LOGGED OUT state and wait for user to push the button.
    - If user pushes the button, run OAuth flow and find out if we're logged in.
2. If logged in, get and display user information.
3. Get user data if it exists, otherwise get NULL.
4. When text is modified, push to server.

isUserLoggedIn()
logIn()
getData()
setData()
