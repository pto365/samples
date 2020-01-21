import * as Msal from "msal";
import { Client } from "@microsoft/microsoft-graph-client";

import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";

import { ImplicitMSALAuthenticationProvider } from "./ImplicitMSALAuthenticationProvider";
//import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
import axios from "axios";

//import Excel from "exceljs"
import _ from "lodash";
var XLSX = require("xlsx");
// Configuration options for MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL.js-1.0.0-api-release#configuration-options
// const msalConfig = {
//     auth: {
//         clientId: "your_client_id", // Client Id of the registered application
//         redirectUri: "your_redirect_uri",
//     },
// };
const intoStream = require("into-stream");
const graphScopes = [
  "User.Read.All",
  "User.ReadWrite.All"
]; // An array of graph scopes

// // Important Note: This library implements loginPopup and acquireTokenPopup flow, remember this while initializing the msal
// // Initialize the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js#1-instantiate-the-useragentapplication

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
var msalConfig = {
  auth: {
    clientId: "443ae28d-8cf8-42fd-ba63-f403ac085ead",
    redirectUri: replyUrl,
    authority: "https://login.microsoftonline.com/common",
    storeAuthStateInCookie:true
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

function get(path) {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    try {
      
      let data = await client.api(path).get();

      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}
function me() {
  return get("/me");
}

function myExtentions() {
  return get("/me/extensions");
}

function alerts() {
  return get("/sites/christianiabpos.sharepoint.com:/sites/intranets-corp:/lists/Service%20Announcements/items");
}

export default {
  me,myExtentions,alerts
  
};

// var PTO365 = {
//   user: msalInstance.getAccount()
// };
// if (!PTO365.user) {
//   msalInstance.loginRedirect(requestObj);
// }
// console.log("User account", PTO365.user);
