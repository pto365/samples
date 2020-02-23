/******************************************************************************************************************************
ZTICKYBAR Notifier

Copyright (c) jumpto365, Inc

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Written by Niels Gregers Johansen <niels@jumpto365.com>, December 2019 - Februar 2020
 */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import OfficeGraphOld from "./helpers/OfficeGraph";
import config from "./config";
import { initializeIcons } from "@uifabric/icons";
import { UserAgentApplication } from "msal";
import AuthHelper from "./officegraph/authHelper";
import OfficeGraph from "./officegraph";
import {
  MessageBarButton,
  Link,
  Stack,
  StackItem,
  MessageBar,
  MessageBarType,
  ChoiceGroup,
  IStackProps,
  PrimaryButton
} from "office-ui-fabric-react";

initializeIcons();

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seenAlerts, setSeenAlerts] = useState({});
  const inFrame = inIframe();
  const [accessToken, setAccessToken] = useState("");

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

  function updateSeenAlerts(_seenAlerts) {
    _seenAlerts.etag++;
    OfficeGraphOld.updateExtention(_seenAlerts)
      .then(() => {
        setSeenAlerts(_seenAlerts);
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.updateExtention() ", error });
        setErrors(errors);
      });
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
          var token = await AuthHelper.getAccessToken(["User.Read.All"]);
          debugger
          setAccessToken(token);
          var me = await OfficeGraph.get(
            token,
            "https://graph.microsoft.com/v1.0/me"
          );
          
          debugger
          setMe(me)
        } catch (error) {
          debugger
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
    if (isSignedIn) {
      getSeenAlerts();
      getAlerts();
    }
  }, [isSignedIn]);
  /******************************************************************************************************************************
   *
   * Main display
   *
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

      <div
        style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "1280px" }}
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
      {/**********************************************************************************************************************
       *
       * Debugging stuff
       *
       *********************************************************************************************************************/}
      <div style={{ position: "absolute", bottom: 0 }}>
        <button onClick={up}>+</button>
        <button onClick={down}>-</button>
        {JSON.stringify(me)}
      </div>
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
        var requestObj = {
          scopes: ["user.read"]
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
        <div>
          <div
            style={{
              display: "flex",
              cursor: alert.url ? "pointer" : "default"
            }}
            onClick={() => {
              down();
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
              <div style={{ fontSize: "24px", padding: "10px" }}>
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
    OfficeGraphOld.getAlerts()
      .then(data => {
        var alertIds = {};
        if (!data.value) return;
        var _alerts = data.value.map(alert => {
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
            //debugger
          }
        });
        var newSeenAlerts = [];
        if (_seenAlerts) {
          _seenAlerts.forEach(seen => {
            if (alertIds[seen.id]) {
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
      })
      .catch(error => {
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
    OfficeGraphOld.myExtentions("intranets_seenAlerts")
      .then(_seenAlerts => {
        try {
          
          //console.log(m.value[0].etag);
          setSeenAlerts(_seenAlerts);
          updateSeenAlerts(_seenAlerts);

          getAlerts(seenAlerts);
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
}
