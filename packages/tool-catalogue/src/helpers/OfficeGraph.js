import * as Msal from "msal";
import { Client } from "@microsoft/microsoft-graph-client";

import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";

import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
var toStream = require('string-to-stream')
// Configuration options for MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL.js-1.0.0-api-release#configuration-options
// const msalConfig = {
//     auth: {
//         clientId: "your_client_id", // Client Id of the registered application
//         redirectUri: "your_redirect_uri",
//     },
// };
const graphScopes = ["user.read", "mail.send", "Files.ReadWrite.All"]; // An array of graph scopes

// // Important Note: This library implements loginPopup and acquireTokenPopup flow, remember this while initializing the msal
// // Initialize the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js#1-instantiate-the-useragentapplication

var replyUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  (window.location.port !== 80 && window.location.port !== 443
    ? ":" + window.location.port
    : "") +
  window.location.pathname;
var msalConfig = {
  auth: {
    clientId: "443ae28d-8cf8-42fd-ba63-f403ac085ead",
    redirectUri: replyUrl,
    authority: "https://login.microsoftonline.com/common"
  }
};
var requestObj = {
  scopes: graphScopes
};
var msalInstance = new Msal.UserAgentApplication(msalConfig);
msalInstance.handleRedirectCallback((error, response) => {
  // handle redirect response or error
});

const msalApplication = new Msal.UserAgentApplication(msalConfig);
const authOptions = new MSALAuthenticationProviderOptions(graphScopes);
const authProvider = new ImplicitMSALAuthenticationProvider(
  msalApplication,
  authOptions
);
const options = {
  authProvider // An instance created from previous step
};

function getClient() {
  const MsClient = Client;
  const client = MsClient.initWithMiddleware(options);
  return client;
}

function me() {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    try {
      let userDetails = await client.api("/me").get();

      return resolve(userDetails);
    } catch (error) {
      return reject(error);
    }
  });
}

function initStorage() {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    try {
      let ztickyFolder = await client.api("/me/drive/root:/ZTICKY").get();
      return resolve(ztickyFolder);
    } catch (error) {
      if (error.statusCode === 404) {
        try {
          const driveItem = {
            name: "ZTICKY",
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename"
          };

          let ztickyFolder = await client
            .api("/me/drive/root/children")
            .post(driveItem);

          return resolve(ztickyFolder);
        } catch (error) {
          return reject(error);
        }
      } else {
        return reject(error);
      }
    }
  });
}
function addTile(ztickyFolder, tile) {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    ;
    try {
      const driveItem = {
        name: tile.title,
        folder: {},
        "@microsoft.graph.conflictBehavior": "replace"
      };
      
      let folder = await client
        .api(`/me/drive/items/${ztickyFolder.id}/children`)
        .post(driveItem);
    
       const stream = toStream(JSON.stringify(tile))
        const fileItem = {
          name: tile.title,
          folder: {},
          "@microsoft.graph.conflictBehavior": "replace"
        };

      let file = await client
        .api(`/me/drive/items/${folder.id}:/tile.json:/content`)
        .put(tile);

      debugger
      return resolve(file);
    } catch (error) {
      debugger
      return reject(error);
    }
  });
}
export default { me, initStorage, addTile };

// var PTO365 = {
//   user: msalInstance.getAccount()
// };
// if (!PTO365.user) {
//   msalInstance.loginRedirect(requestObj);
// }
// console.log("User account", PTO365.user);
