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
import AuthHelper from "./officegraph/authHelper";
import OfficeGraph from "./officegraph";
import moment from "moment";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Button
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

/******************************************************************************************************************************
 *
 * Proxied class
 *
 ******************************************************************************************************************************/
class ZTICKYBAR {
  static init = () => {
    return new ZTICKYBAR();
  };
  constructor() {
    this._key = "123";
    this._targetOrigin = "*";
  }

  /******************************************************************************************************************************
   *
   * Returns a promise of returning an array of tiles
   *
   ******************************************************************************************************************************/
  tools = () => {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  };
  /******************************************************************************************************************************
   *
   * setNotificationCount Update the visual notification counter on a given tile
   * @param {*} tileId Number of the tile
   * @param {*} count  Count to set, only whole numbers (integers) are accepted. Setting the value to 0 will hide the notification counter
   *
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

/**
 *
 *
 *
 */
export default function Alerts() {
  const SCOPES = ["User.ReadWrite", "Sites.Read.All"];
  const [isSignedIn, setIsSignedIn] = useState(true);

  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seenAlerts, setSeenAlerts] = useState({});
  const inFrame = inIframe();
  const [accessToken, setAccessToken] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
   * Initial page load
   *
   ******************************************************************************************************************************/

  async function load() {
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
            <div style={{ flexGrow: 1 }}>
              <div>Unread: {unreadCount}</div>
              <div>
                <Button
                  text="clear"
                  onClick={() => {
                    saveSeenAlerts([]);
                  }}
                />
              </div>
              {JSON.stringify(seenAlerts)}
            </div>
            <div style={{ padding: 8, textAlign: "right" }}>
              <div><a href="https://www.jumpto365.com" target="_blank">ZTICKYBAR Notifier</a></div>
              <div>Version {packageData.version}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
              fontWeight: alert.read ? 300 : 600,
              display: "flex",
              cursor: isProcessing ? "wait" : "pointer"
            }}
            onClick={() => {
              if (isProcessing) return;
              if (!alert.read) {
                setIsProcessing(true);
                seenAlerts.push({
                  id: alert.id,
                  url: alert.url,
                  date: moment.utc()
                });
                saveSeenAlerts(seenAlerts)
                  .then(() => {
                    setIsProcessing(false);
                  })
                  .catch(() => {
                    setIsProcessing(false);
                  });
              }
            }}
          >
            {/* <div>
              <img
                style={{ width: "80px", padding: "10px" }}
                src={
                  alert.image
                    ? alert.image
                    : "https://www.huntersglenvet.com/wp-content/uploads/2018/03/xpop-up-alert.png.pagespeed.ic_.vwzzZnK_Rf-288x300.png"
                }
              ></img>
            </div> */}
            <div style={{ position: "relative", flexGrow: 1 }}>
              <div
                style={{
                  fontSize: "24px",
                  padding: "10px"
                }}
              >
                {alert.title}
              </div>
              <div style={{ fontSize: "12px", padding: "10px" }}>
                {alert.message}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  // position: "absolute",
                  // bottom: 0,
                  padding: "10px"
                }}
              >
                Last updated: {moment(alert.date).format("LLLL")}
              </div>
            </div>
            <div>
              {alert.url && (
                <a href={alert.url} target="_blank">
                  Details
                </a>
              )}
            </div>
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
      config.currentAlerts
      //"https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/intranets-corp:/lists/currentAlerts/items?expand=fields"
    )

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
              alertIds[seen.id].read = true;
              newSeenAlerts.push({
                id: seen.id,
                url: alertIds[seen.id].url
              });
            }
          });
        }
        var count = _alerts.length - _seenAlerts.length;
        var ztickyBar = ZTICKYBAR.init();
        setUnreadCount(count);
        window.document.title = count > 0 ? config.title + " (" + count + " unread)": config.title
        ztickyBar.setNotificationCount(3, count);
        setAlerts(_alerts);
        setSeenAlerts(_seenAlerts);
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
      `https://graph.microsoft.com/v1.0/me/extensions/${config.extensionName}`
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
          context: "OfficeGraph.myExtentions() ",
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
  function saveSeenAlerts(_seenAlerts) {
    return new Promise(async (resolve, reject) => {
      var extension = await OfficeGraph.get(
        accessToken,
        `https://graph.microsoft.com/v1.0/me/extensions/${config.extensionName}`
      );

      var method = extension
        ? OfficeGraph.patch(
            accessToken,
            `https://graph.microsoft.com/v1.0/me/extensions/${config.extensionName}`,
            {
              "@odata.type": "#microsoft.graph.openTypeExtension",
              extensionName: config.extensionName,
              seenAlerts: _seenAlerts,
              etag: extension.etag + 1,
              id: config.extensionName
            }
          )
        : OfficeGraph.post(
            accessToken,
            `https://graph.microsoft.com/v1.0/me/extensions`,
            {
              "@odata.type": "#microsoft.graph.openTypeExtension",
              extensionName: config.extensionName,
              seenAlerts: _seenAlerts,
              etag: 1,
              id:config.extensionName
            }
          );

      method
        .then(extensionData => {
          try {
            setRefresh(refresh + 1);
            resolve();
          } catch (error) {
            errors.push({
              context: "Post init",
              error
            });
            setErrors(errors);
            getAlerts(null);
            resolve();
          }
        })
        .catch(error => {
          errors.push({
            context: "setSeenAlerts ",
            error
          });
          setErrors(errors);
          resolve();
        });
    });
  }
}
