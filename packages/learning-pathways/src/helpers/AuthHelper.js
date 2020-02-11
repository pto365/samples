import { UserAgentApplication } from "msal";

export class ImplicitMSALAuthenticationProvider {
  constructor(msalApplication, options) {
    this.options = options;
    this.msalApplication = msalApplication;
  }

  getAccessToken(authenticationProviderOptions) {
    return new Promise(async (resolve, reject) => {
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
      var requestObj = {
        scopes: [
          "User.Read.All",
          "User.ReadWrite.All",
          "mail.send",
          "Files.ReadWrite.All"
        ]
      };
      var msalInstance = new UserAgentApplication(msalConfig);
      msalInstance.handleRedirectCallback((error, response) => {
        // handle redirect response or error
      });

      if (!msalInstance.getAccount()) {
        msalInstance.loginRedirect(requestObj);
      }
      try {
        const authResponse = await this.msalApplication.acquireTokenSilent(
          requestObj
        );
        resolve(authResponse.accessToken);
      } catch (error) {
        reject(error);
      }
    });
  }
}
