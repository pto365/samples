import * as Msal from "msal";

function login(){
  debugger
var replyUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port !== 80 && window.location.port !== 443 && window.location.port !== "" ? (":" + window.location.port) : "") + window.location.pathname;
console.log("login replyUrl",replyUrl)
var msalConfig = {
  auth: {
    clientId: "443ae28d-8cf8-42fd-ba63-f403ac085ead",
    redirectUri: replyUrl,
    authority: "https://login.microsoftonline.com/common"
  }
};
var requestObj = {
  scopes: ["user.read", "Files.ReadWrite.All"]
};
var msalInstance = new Msal.UserAgentApplication(msalConfig);
msalInstance.handleRedirectCallback((error, response) => {
  // handle redirect response or error
});
var PTO365 = {
  user: msalInstance.getAccount()
};
if (!PTO365.user) {
  msalInstance.loginRedirect(requestObj);
}
console.log("User account", PTO365.user);
}
export {login};