/* 
Tool Catalogue

Copyright (c) jumpto365, Inc

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Written by Niels Gregers Johansen <niels@jumpto365.com>, December 2019
 */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import OfficeGraph from "./helpers/OfficeGraph";
import config from "./config";
import { initializeIcons } from "@uifabric/icons";
import {
  MessageBarButton,
  Link,
  Stack,
  StackItem,
  MessageBar,
  MessageBarType,
  ChoiceGroup,
  IStackProps
} from "office-ui-fabric-react";
initializeIcons();
export function getSearchParametersFromHRef(href) {
  if (!href) return {};
  var search = {};
  var s1 = href.split("?");
  if (s1.length > 1) {
    var s2 = s1[1].split("&");
    for (let index = 0; index < s2.length; index++) {
      const s3 = s2[index].split("=");
      search[s3[0]] = decodeURIComponent(s3[1]);
    }
  }
  return search;
}

export function getSearchParametersFromHash(href) {
  if (!href) return {};
  var search = {};
  var s1 = href.split("#");
  if (s1.length > 1) {
    var s2 = s1[1].split("&");
    for (let index = 0; index < s2.length; index++) {
      const s3 = s2[index].split("=");
      search[s3[0]] = decodeURIComponent(s3[1]);
    }
  }
  return search;
}

class ZTICKYBAR {
  static init = () => {
    return new ZTICKYBAR();
  };
  constructor() {
    this._key = "123";
    this._targetOrigin = "*";
  }

  /**
   * Returns a promise of returning an array of tiles
   */
  tools = () => {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  };
  /**
   * setNotificationCount Update the visual notification counter on a given tile
   * @param {*} tileId Number of the tile
   * @param {*} count  Count to set, only whole numbers (integers) are accepted. Setting the value to 0 will hide the notification counter
   */
  setNotificationCount = (tileId, count) => {
    //debugger

    var target = window.self !== window.top ? window.top : window.self;
    if (target) {
      //  console.log(window.parent.location.href)
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
  seenAlerts: [
    {
      url: "https://christianiabpos.sharepoint.com/sites/intranets-corp",
      date: "24/01/2022"
    }
  ],
  etag: 152,
  id: "intranets_seenAlerts"
};
export default function Alarms() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seenAlerts, setSeenAlerts] = useState({});
const down = () => {
  //debugger
  var c = localStorage.getItem("ztickyBarNotificationCount");
  var count = c ? (parseInt(c) > 0 ? parseInt(c) - 1 : 1) : 0;
  localStorage.setItem("ztickyBarNotificationCount", count);

  var ztickyBar = ZTICKYBAR.init();
  ztickyBar.setNotificationCount(3, count);
}
  function updateSeenAlerts(_seenAlerts) {
    _seenAlerts.etag++;
    OfficeGraph.updateExtention(_seenAlerts)
      .then(() => {
        setSeenAlerts(_seenAlerts);
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.updateExtention() ", error });
        setErrors(errors);
      });
  }
  useEffect(() => {
    var ztickyBar = ZTICKYBAR.init();
    var ztickyBarNotificationCount = localStorage.getItem(
      "ztickyBarNotificationCount"
    );
    var count = ztickyBarNotificationCount
      ? parseInt(ztickyBarNotificationCount)
      : 0;
    ztickyBar.setNotificationCount(3, count);
    // return;
    OfficeGraph.myExtentions("intranets_seenAlerts")
      .then(_seenAlerts => {
        try {
          setMe(_seenAlerts);
          //console.log(m.value[0].etag);
          setSeenAlerts(_seenAlerts);
          updateSeenAlerts(_seenAlerts);
          var ztickyBar = ZTICKYBAR.init();
          ztickyBar.setNotificationCount(3, 2);
        } catch (error) {
          errors.push({
            context: "Post init",
            error
          });
          setErrors(errors);
        }
      })
      .catch(error => {
        errors.push({
          context: "OfficeGraph.myExtentions('intranets_seenAlerts') ",
          error
        });
        setErrors(errors);
      });

    OfficeGraph.getAlerts()
      .then(data => {
        if (!data.value) return;
        var _alerts = data.value.map(alert => {
          

          try {
            var x = {
              id: alert.fields.id,
              title: alert.fields.Title,
              active: alert.fields.Active,
              date: alert.fields.Date,
              message:alert.fields.Message,
              image : alert.fields.RollupImage ?alert.fields.RollupImage.Url : null
            }
            return x
          } catch (error) {
            //debugger
          }
         
        });
      
        setAlerts(_alerts);
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.getAlerts() ", error });
        setErrors(errors);
      });
  }, []);

  return (
    <div>
      {config.title}
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
      {/* <hr />
      {JSON.stringify(seenAlerts)}
      <hr />
      {JSON.stringify(alerts)} */}


      {alerts.map((alert,key)=>{
        return (
          <div>
<div style={{display:"flex"}}>
  <div onClick={down}><img style={{width:"120px",padding:"10px"}} src={alert.image ? alert.image : "https://www.huntersglenvet.com/wp-content/uploads/2018/03/xpop-up-alert.png.pagespeed.ic_.vwzzZnK_Rf-288x300.png"}></img></div>
       <div>
        <div style={{fontSize:"24px",padding:"10px"}}>{alert.title}</div>
        <div style={{fontSize:"12px",padding:"10px"}}>
        {alert.message}
        </div>
        </div>
  <div></div>
</div>
</div>
        )
      })}
      <hr />
      <button
        onClick={() => {
          //debugger
          var c = localStorage.getItem("ztickyBarNotificationCount");
          var count = c ? (parseInt(c) > 0 ? parseInt(c) + 1 : 1) : 0;
          localStorage.setItem("ztickyBarNotificationCount", count);

          var ztickyBar = ZTICKYBAR.init();
          ztickyBar.setNotificationCount(3, count);
        }}
      >
        +
      </button>
      <button
        onClick={down}
      >
        -
      </button>
    </div>
  );
}
