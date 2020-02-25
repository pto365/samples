/******************************************************************************************************************************
ZTICKYBAR Publisher

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
export default function Publisher() {
  const SCOPES = config.scopes;
  const [isSignedIn, setIsSignedIn] = useState(true);

  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [links, setLinks] = useState([]);

  const inFrame = inIframe();
  const [accessToken, setAccessToken] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
    load();
    if (accessToken) {
      getLinks();
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
           * And finally show the alerts
           *
           *********************************************************************************************************************/}
          Publisher
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
            </div>
<div>
  {JSON.stringify(links)}
</div>
            <div style={{ padding: 8, textAlign: "right" }}>
              <div>
                <a href="https://www.jumpto365.com" target="_blank">
                  ZTICKYBAR Publisher
                </a>
              </div>
              <div>Version {packageData.version}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /******************************************************************************************************************************
   *
   * Load links
   *
   ******************************************************************************************************************************/
  function getLinks() {
    OfficeGraph.get(accessToken, config.model.toolLists[0].graphUrl)

      .then(data => {
        if (!data) return;

        var _links = data.map(alert => {
          try {
            var x = {
              id: alert.fields.id,
              title: alert.fields.Title,
              articleUrl: alert.fields.Article_x0020_Page
                ? alert.fields.Article_x0020_Page.Url
                : null,
              iconUrl: alert.fields.Icon ? alert.fields.Icon.Url : null,
              slug: alert.fields.slug,
              color: alert.fields.Color,
              textColor: alert.fields.TextColor,
              message: alert.fields.Message,
              toolbars: alert.fields.Toolbars
            };

            return x;
          } catch (error) {
            errors.push({ context: "OfficeGraph.getLinks() map ", error });
            setErrors(errors);
          }
        });

        setLinks(_links);
        // setRefresh(refresh + 1);
      })
      .catch(error => {
        debugger;
        errors.push({ context: "OfficeGraph.getLinks() ", error });
        setErrors(errors);
      });
  }
}
