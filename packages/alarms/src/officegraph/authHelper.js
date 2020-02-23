import { UserAgentApplication } from "msal";

function getAccessToken (scopes) {
  var replyUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port !== 80 &&
    window.location.port !== 443 &&
    window.location.port !== ""
      ? ":" + window.location.port
      : "") +
    window.location.pathname;
  console.log("login replyUrl", replyUrl);
  var msalConfig = {
    auth: {
      clientId: "443ae28d-8cf8-42fd-ba63-f403ac085ead",
      redirectUri: replyUrl,
      authority: "https://login.microsoftonline.com/common"
    }
  };
  var msalApplication = new UserAgentApplication(msalConfig);

  return new Promise(async (resolve, reject) => {
    var requestObj = {
      scopes
    };

    msalApplication.handleRedirectCallback((error, response) => {
      // handle redirect response or error
    });

    if (!msalApplication.getAccount()) {
      msalApplication.loginRedirect(requestObj);
    }
    try {
      const authResponse = await msalApplication.acquireTokenSilent(
        requestObj
      );
      resolve(authResponse.accessToken);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAccessToken
  
};