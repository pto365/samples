import * as Msal from "msal";
import { Client } from "@microsoft/microsoft-graph-client";

import { MSALAuthenticationProviderOptions } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions";

import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";
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
const graphScopes = ["User.Read.All", "User.ReadWrite.All","mail.send", "Files.ReadWrite.All"]; // An array of graph scopes

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
      let ztickyFolder = await client.api("/me/drive/root:/ZTICKYBAR").get();
      return resolve(ztickyFolder);
    } catch (error) {
      if (error.statusCode === 404) {
        try {
          const driveItem = {
            name: "ZTICKYBAR",
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
function initTileStorage() {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    try {
      let ztickyFolder = await client
        .api("/me/drive/root:/ZTICKYBAR/tiles")
        .get();
      return resolve(ztickyFolder);
    } catch (error) {
      if (error.statusCode === 404) {
        try {
          const driveItem = {
            name: "tiles",
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename"
          };

          let ztickyFolder = await client
            .api("/me/drive/root:/ZTICKYBAR:/children")
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
function getMyTools(ztickyFolder, refresh) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!refresh) {
        var cache = localStorage.getItem("mytools");
        if (cache) {
          return resolve(JSON.parse(cache));
        }
      }
      const client = getClient();
      let folders = await client
        .api(`/me/drive/items/${ztickyFolder.id}/children`)
        .get();

      var queueLength = 0;

      if (folders.value.length === 0) return resolve(folders.value);

      folders.value.forEach(async folder => {
        queueLength++;
        folder.tile = await getMyTool(folder);

        queueLength--;
        if (queueLength === 0) {
          localStorage.setItem("mytools", JSON.stringify(folders.value));
          return resolve(folders.value);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getMyTool(toolFolder) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = getClient();
      let tile = await client
        .api(`/me/drive/items/${toolFolder.id}:/tile.json:`)
        .get();
      axios.get(tile["@microsoft.graph.downloadUrl"]).then(response => {
        resolve(response.data);
      });
    } catch (error) {
      debugger;
      reject(error);
    }
  });
}
function addTile(ztickyFolder, tile) {
  return new Promise(async (resolve, reject) => {
    const client = getClient();
    try {
      const driveItem = {
        name: tile.title,
        folder: {},
        "@microsoft.graph.conflictBehavior": "replace"
      };

      let folder = await client
        .api(`/me/drive/items/${ztickyFolder.id}/children`)
        .post(driveItem);

      let file = await client
        .api(`/me/drive/items/${folder.id}:/tile.json:/content`)
        .put(tile);

      // var workbook1 =new Excel.Workbook()
      // workbook1.creator = "ZTICKYBAR";
      // workbook1.lastModifiedBy = "ZTICKYBAR";
      // workbook1.created = new Date();
      // workbook1.modified = new Date();
      // var sheet1 = workbook1.addWorksheet("tile");
      // sheet1.addTable({
      //   name: 'MyTable',
      //   ref: 'A1',
      //   headerRow: true,
      //   totalsRow: true,
      //   style: {
      //     theme: 'TableStyleDark3',
      //     showRowStripes: true,
      //   },
      //   columns: [
      //     {name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
      //     {name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
      //   ],
      //   rows: [
      //     [new Date('2019-07-20'), 70.10],
      //     [new Date('2019-07-21'), 70.60],
      //     [new Date('2019-07-22'), 70.10],
      //   ],
      // });
      // var stream = workbook1.xlsx.createInputStream()
      // workbook1.xlsx.write(stream).then(async ()=>{
      //   //var payload = new Blob(buffer)
      //   debugger
      //  var x = await client
      //   .api(`/me/drive/items/${folder.id}:/tile.xlsx:/content`)
      //   .header('Content-Type', 'application/octet-stream')
      //   .put(stream.stream);
      //   debugger
      // })

      var props = _.keys(tile);
      var data = [];
      props.forEach(prop => {
        if (prop === "references") return;
        data.push([prop, tile[prop]]);
      });
      var workbook = XLSX.utils.book_new();

      debugger;
      var ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, ws, "ZTICKYBAR");
      var wopts = { bookType: "xlsx", bookSST: false, type: "array" };

      var wbout = XLSX.write(workbook, wopts);

      var x = await client
        .api(`/me/drive/items/${folder.id}:/tile.xlsx:/content`)
        //.header('Content-Type', 'application/octet-stream')
        .put(wbout);
      debugger;

      axios
        .request({
          responseType: "arraybuffer",
          url: tile.icon,
          method: "get"
        })
        .then(async response => {
          await client
            .api(`/me/drive/items/${folder.id}:/image.png:/content`)
            .put(response.data);
        })
        .catch(error => {
          debugger;
        });

      return resolve(file);
    } catch (error) {
      debugger;
      return reject(error);
    }
  });
}

function teamMemberships() {
  return new Promise(async (resolve, reject) => {
    var groups = [];

    try {
      const client = getClient();

      client
        .api("/me/joinedTeams")
       // .version('beta')
        .get(async (error, memberships) => {
          if (error) {
            return reject(error);
          }
          var pending = 0;
          memberships.value.map(async value => {
            pending++;
            var photo = await client
              .api(
                `/groups/${value.id}/photo/$value`
              )
              .get();

            var details = await client
              .api(`/teams/${value.id}`)
              //.version("beta")
              .get();

           
            groups.push({
              key: value.id,
              text: value.displayName,
              title: value.description,

              data: {
                details,
                photo
              }
            });
            pending--;
            if (pending === 0) {
              return resolve(
                groups.sort((a, b) => {
                  if (a.text < b.text) {
                    return -1;
                  }
                  if (a.text > b.text) {
                    return 1;
                  }
                  return 0;
                })
              );
            }
          });
        });
    } catch (error) {
      return reject(error);
    }
  });
}
export default {
  me,
  initStorage,
  initTileStorage,
  addTile,
  getMyTools,
  teamMemberships
};

// var PTO365 = {
//   user: msalInstance.getAccount()
// };
// if (!PTO365.user) {
//   msalInstance.loginRedirect(requestObj);
// }
// console.log("User account", PTO365.user);
