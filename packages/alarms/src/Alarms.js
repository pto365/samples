/******************************************************************************************************************************
ZTICKYBAR Notifier

Copyright (c) jumpto365, Inc

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
------------------------------------------------------------------------------------------------------------------------------
 
 Written by Niels Gregers Johansen <niels@jumpto365.com>, December 2019 - Februar 2020

 *******************************************************************************************************************************/
import React, { useState, useEffect } from "react";
import _ from "lodash";

import config from "./config";
import { initializeIcons } from "@uifabric/icons";
import { UserAgentApplication } from "msal";
import AuthHelper from "./officegraph/authHelper";
import OfficeGraph from "./officegraph";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton
} from "office-ui-fabric-react";
import "./App.css";
import packageData from "../package.json";
initializeIcons();

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Proxied class
 */
class ZTICKYBAR {
  static init = () => {
    return new ZTICKYBAR();
  };
  constructor() {
    this._key = "123";
    this._targetOrigin = "*";
  }

  /******************************************************************************************************************************
   * Returns a promise of returning an array of tiles
   ******************************************************************************************************************************/
  tools = () => {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  };
  /******************************************************************************************************************************
   * setNotificationCount Update the visual notification counter on a given tile
   * @param {*} tileId Number of the tile
   * @param {*} count  Count to set, only whole numbers (integers) are accepted. Setting the value to 0 will hide the notification counter
   ******************************************************************************************************************************/
  setNotificationCount = (tileId, count) => {
    var target = window.self !== window.top ? window.top : window.self;
    if (target) {
      target.postMessage(
        {
          action: "setNotificationCount",
          count,
          tileId,
          key: this._key
        },
        this._targetOrigin
      );
    }
  };
  get openerHref() {
    return this._openerHref;
  }
  get tileId() {
    return this._tileId;
  }
}
var defaultExtension = {
  extensionName: "intranets_seenAlerts",
  seenAlerts: [],
  etag: 1,
  id: "intranets_seenAlerts"
};
export default function Alarms() {
  const SCOPES = ["User.Read.All", "Sites.Read.All"];
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seenAlerts, setSeenAlerts] = useState({});
  const inFrame = inIframe();
  const [accessToken, setAccessToken] = useState("");
  const [refresh, setRefresh] = useState(0);

  /******************************************************************************************************************************
   *
   * Decrease the number of unseen alerts
   *
   * (DEBUGGING FUNCTION)
   ******************************************************************************************************************************/
  const down = () => {
    var c = localStorage.getItem("ztickyBarNotificationCount");
    var count = c ? (parseInt(c) > 0 ? parseInt(c) - 1 : 1) : 0;
    localStorage.setItem("ztickyBarNotificationCount", count);

    var ztickyBar = ZTICKYBAR.init();
    ztickyBar.setNotificationCount(3, count);
  };
  /******************************************************************************************************************************
   *
   * Increase the number of unseen alerts
   *
   * (DEBUGGING FUNCTION)
   ******************************************************************************************************************************/

  const up = () => {
    var c = localStorage.getItem("ztickyBarNotificationCount");
    var count = c ? (parseInt(c) > 0 ? parseInt(c) + 1 : 1) : 0;
    localStorage.setItem("ztickyBarNotificationCount", count);

    var ztickyBar = ZTICKYBAR.init();
    ztickyBar.setNotificationCount(3, count);
  };
  /******************************************************************************************************************************
   *
   * Save a list of seen alerts
   *
   ******************************************************************************************************************************/
  // function myExtentions(id) {
  //   return get(`/me/extensions/${id}`);
  // }

  // function updateExtention(data) {
  //   return patch(`/me/extensions/${data.id}`,data);
  // }

  // function setExtention(data) {
  //   return post(`/me/extensions/${data.id}`,data);
  // }

  function updateSeenAlerts(_seenAlerts) {
    // _seenAlerts.etag++;
    // OfficeGraphOld.updateExtention(_seenAlerts)
    //   .then(() => {
    //     setSeenAlerts(_seenAlerts);
    //   })
    //   .catch(error => {
    //     errors.push({ context: "OfficeGraph.updateExtention() ", error });
    //     setErrors(errors);
    //   });
  }
  /******************************************************************************************************************************
   *
   * Initial page load
   *
   ******************************************************************************************************************************/

  async function load() {
    auth()
      .then(async user => {
        setIsSignedIn(true);

        try {
          var token = await AuthHelper.getAccessToken(SCOPES);

          setAccessToken(token);
          var me = await OfficeGraph.get(
            token,
            "https://graph.microsoft.com/v1.0/me"
          );

          setMe(me);
        } catch (error) {
          switch (error.errorCode) {
            case "user_login_error":
              debugger;
              break;

            default:
              debugger;
              break;
          }

          errors.push({
            context: " OfficeGraph.auth.getAccessToken()",
            error
          });
          setErrors(errors);
        }

        // OfficeGraph.me().then(me=>{
        //   debugger
        // })
        // .catch(error => {
        //   errors.push({ context: " OfficeGraph.me() ", error });
        //   setErrors(errors);
        // });
      })
      .catch(error => {
        errors.push({ context: "useEffect().auth() ", error });
        setErrors(errors);
      });
  }
  /******************************************************************************************************************************
   *
   * Update the UI when necessary
   *
   ******************************************************************************************************************************/

  useEffect(() => {
    var ztickyBar = ZTICKYBAR.init();
    var ztickyBarNotificationCount = localStorage.getItem(
      "ztickyBarNotificationCount"
    );
    var count = ztickyBarNotificationCount
      ? parseInt(ztickyBarNotificationCount)
      : 0;
    // ztickyBar.setNotificationCount(3, count);
    // return;
    load();
    if (accessToken) {
      getSeenAlerts();
      //getAlerts();
    }
  }, [accessToken, refresh]);
  /******************************************************************************************************************************
   * ******************************************************************************************************************************
   *
   *     MAIN display
   *
   *******************************************************************************************************************************
   ******************************************************************************************************************************/

  return (
    <div style={{ position: "relative", height: "95vh" }}>
      {/**********************************************************************************************************************
       *
       * If the page is not shown in an iFrame, show a custom header
       *
       *********************************************************************************************************************/}
      {!inFrame &&
        config.components &&
        config.components.header &&
        config.components.header}
      {/**********************************************************************************************************************
       *
       * If errors has occured, show on at a time
       *
       *********************************************************************************************************************/}
      {errors.length > 0 && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={() => {
            setErrors(errors.slice(1));
          }}
          dismissButtonAriaLabel="Close"
        >
          Error: {JSON.stringify(errors[0])}
        </MessageBar>
      )}
      <div style={{ backgroundColor: "#eeeeee" }}>
        <div
          style={{
            padding: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "1280px",
            backgroundColor: "#ffffff",
            height: "80vh"
          }}
        >
          {/**********************************************************************************************************************
           *
           * If not signed in, show a Sign In button
           *
           *********************************************************************************************************************/}
          {!isSignedIn && (
            <div style={{ textAlign: "center", marginTop: "30vh" }}>
              <PrimaryButton
                text="Sign in"
                onClick={() => {
                  alert("Not implemented");
                }}
              ></PrimaryButton>
            </div>
          )}
          {/**********************************************************************************************************************
           *
           * And finally show the alerts
           *
           *********************************************************************************************************************/}
          {showAlerts()}
        </div>
      </div>
      {/**********************************************************************************************************************
       *
       * Debugging stuff, only visible when not in an iframe
       *
       *********************************************************************************************************************/}
      {!inFrame && (
        <div style={{ position: "absolute", bottom: 0 }}>
          <div style={{ display: "flex", width: "100vw" }}>
            <div style={{ flexGrow: 1, padding: 8 }}>
              {me && (
                <div>
                  {me.displayName} ({me.userPrincipalName})
                </div>
              )}
              {config.alertsUrl && (
                <a href={config.alertsUrl} target="_blank">
                  {config.alertsUrl}
                </a>
              )}
              <div>
              <button onClick={up}>+</button>
              <button onClick={down}>-</button>
              </div>
            </div>
            <div style={{ padding: 8, textAlign: "right" }}>
              <div>ZTICKYBAR Notifier</div>
              <div>Version {packageData.version}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  /******************************************************************************************************************************
   *
   * Authenticate
   *
   ******************************************************************************************************************************/
  function auth() {
    return new Promise((resolve, reject) => {
      try {
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
            clientId: config.clientId,
            redirectUri: replyUrl
          }
        };
         /**
    export declare type AuthenticationParameters = {
    scopes?: Array<string>;
    extraScopesToConsent?: Array<string>;
    prompt?: string;
    extraQueryParameters?: StringDict;
    claimsRequest?: string;
    authority?: string;
    state?: string;
    correlationId?: string;
    account?: Account;
    sid?: string;
    loginHint?: string;
    forceRefresh?: boolean;
    redirectUri?: string;
};
           */
        var requestObj = {
          scopes: SCOPES
        };
        var msalInstance = new UserAgentApplication(msalConfig);
        msalInstance.handleRedirectCallback((error, response) => {
          // handle redirect response or error
        });
        var PTO365 = {
          user: msalInstance.getAccount()
        };


        if (!PTO365.user) {
         
          msalInstance.loginRedirect(requestObj);
        }

        resolve(PTO365.user);
      } catch (error) {
        reject(error);
      }
    });
  }
  /******************************************************************************************************************************
   *
   * Shows the current alerts
   *
   ******************************************************************************************************************************/
  function showAlerts() {
    return alerts.map((alert, key) => {
      return (
        <div className="alert">
          <div
            style={{
              display: "flex",
              cursor: alert.url ? "pointer" : "default"
            }}
            onClick={() => {
              if (!alert.read) {
                saveSeenAlerts()
                //setRefresh(refresh+1)
              }
              //down();
              if (alert.url) window.open(alert.url, "_blank");
            }}
          >
            <div>
              <img
                style={{ width: "80px", padding: "10px" }}
                src={
                  alert.image
                    ? alert.image
                    : "https://www.huntersglenvet.com/wp-content/uploads/2018/03/xpop-up-alert.png.pagespeed.ic_.vwzzZnK_Rf-288x300.png"
                }
              ></img>
            </div>
            <div style={{ position: "relative", flexGrow: 1 }}>
              <div style={{ fontSize: "24px", padding: "10px",fontWeight:alert.read ? 300 :900  }}>
                {alert.title}
              </div>
              <div style={{ fontSize: "12px", padding: "10px" }}>
                {alert.message}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  position: "absolute",
                  bottom: 0,
                  padding: "10px"
                }}
              >
                Last updated: {alert.date}
              </div>
            </div>
            <div></div>
          </div>
        </div>
      );
    });
  }
  /******************************************************************************************************************************
   *
   * Load current alerts
   *
   ******************************************************************************************************************************/
  function getAlerts(_seenAlerts) {
    OfficeGraph.get(
      accessToken,
      "https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/intranets-corp:/lists/currentAlerts/items?expand=fields"
    )
      //  OfficeGraphOld.getAlerts()
      .then(data => {
        var alertIds = {};
        if (!data) return;
        var _alerts = data.map(alert => {
          try {
            var x = {
              id: alert.fields.id,
              title: alert.fields.Title,
              active: alert.fields.Active,
              date: alert.fields.Date,
              message: alert.fields.Message,
              image: alert.fields.RollupImage
                ? alert.fields.RollupImage.Url
                : null,
              url: alert.fields.Url ? alert.fields.Url.Url : null
            };
            alertIds[alert.fields.id] = x;
            return x;
          } catch (error) {
            errors.push({ context: "OfficeGraph.getAlerts() map ", error });
            setErrors(errors);
          }
        });
        //debugger
        var newSeenAlerts = [];
        if (_seenAlerts) {
          _seenAlerts.forEach(seen => {
            if (alertIds[seen.id]) {
              alertIds[seen.id].read = true
              newSeenAlerts.push({
                id: seen.id,
                url: alertIds[seen.id].url
              });
            }
          });
        }
        var ztickyBar = ZTICKYBAR.init();
        ztickyBar.setNotificationCount(3, _alerts.length);
        setAlerts(_alerts);
       // setRefresh(refresh + 1);
      })
      .catch(error => {
        debugger;
        errors.push({ context: "OfficeGraph.getAlerts() ", error });
        setErrors(errors);
      });
  }
  /******************************************************************************************************************************
   *
   * Load already seenalerts
   *
   ******************************************************************************************************************************/
  function getSeenAlerts() {
    // OfficeGraphOld.myExtentions("intranets_seenAlerts")
    OfficeGraph.get(
      accessToken,
      `https://graph.microsoft.com/v1.0/me/extensions/intranets_seenAlerts`
    )
      .then(extensionData => {
        try {
          //console.log(m.value[0].etag);
          // setSeenAlerts(_seenAlerts);
          // updateSeenAlerts(_seenAlerts);

          getAlerts(extensionData.seenAlerts);
        } catch (error) {
          errors.push({
            context: "Post init",
            error
          });
          setErrors(errors);
          getAlerts(null);
        }
      })
      .catch(error => {
        errors.push({
          context: "OfficeGraph.myExtentions('intranets_seenAlerts') ",
          error
        });
        setErrors(errors);
      });
  }
  /******************************************************************************************************************************
   *
   * Save seenalerts
   *
   ******************************************************************************************************************************/
  async function saveSeenAlerts() {
    // OfficeGraphOld.myExtentions("intranets_seenAlerts")
    
    var extension = await OfficeGraph.get(accessToken,`https://graph.microsoft.com/v1.0/me/extensions/intranets_seenAlerts`)
    
    var method  = extension ?  OfficeGraph.patch(
      accessToken,
      `https://graph.microsoft.com/v1.0/me/extensions/intranets_seenAlerts`,
      {
        "@odata.type": "#microsoft.graph.openTypeExtension",
        "extensionName": "intranets_seenAlerts",
        "seenAlerts": [
          {
            "url": "https://christianiabpos.sharepoint.com/sites/intranets-corp",
            "date": "24/01/2022"
          },
          {
            "url": "https://christianiabpos.sharepoint.com/sites/intranets-corp/Lists/currentAlerts/AllItems.aspx",
            "date": "23"
          }
        ],
        "etag": 402,
        "id": "intranets_seenAlerts"
      }
      
    ) : OfficeGraph.post(
      accessToken,
      `https://graph.microsoft.com/v1.0/me/extensions`,
      {
        "@odata.type": "#microsoft.graph.openTypeExtension",
        "extensionName": "intranets_seenAlerts",
        "seenAlerts": [
          {
            "url": "https://christianiabpos.sharepoint.com/sites/intranets-corp",
            "date": "24/01/2022"
          },
          {
            "url": "https://christianiabpos.sharepoint.com/sites/intranets-corp/Lists/currentAlerts/AllItems.aspx",
            "date": "23"
          }
        ],
        "etag": 402,
        "id": "intranets_seenAlerts"
      }
      
    )
    
    
    method
      .then(extensionData => {
        try {
          
          
        } catch (error) {
          errors.push({
            context: "Post init",
            error
          });
          setErrors(errors);
          getAlerts(null);
        }
      })
      .catch(error => {
        errors.push({
          context: "setSeenAlerts ",
          error
        });
        setErrors(errors);
      });
  }
}
