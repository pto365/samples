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

export default function Alarms() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [me, setMe] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [seenAlerts, setSeenAlerts] = useState({});

  function updateSeenAlerts() {
    debugger;
    seenAlerts.etag++;
    OfficeGraph.updateExtention(seenAlerts)
      .then(() => {})
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
    OfficeGraph.myExtentions()
      .then(m => {
        setMe(m);
        console.log(m.value[0].etag);
        setSeenAlerts(m.value[0]);

        var ztickyBar = ZTICKYBAR.init();
        ztickyBar.setNotificationCount(3, 2);
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.myExtentions() ", error });
        setErrors(errors);
      });

    OfficeGraph.alerts()
      .then(data => {
        //setAlerts()
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.alerts() ", error });
        setErrors(errors);
      });
  }, []);

  return (
    <div>
      Alarms
      <hr />
      {JSON.stringify(me)}
      <hr />
      {JSON.stringify(errors)}
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
        onClick={() => {
          //debugger
          var c = localStorage.getItem("ztickyBarNotificationCount");
          var count = c ? (parseInt(c) > 0 ? parseInt(c) - 1 : 1) : 0;
          localStorage.setItem("ztickyBarNotificationCount", count);

          var ztickyBar = ZTICKYBAR.init();
          ztickyBar.setNotificationCount(3, count);
        }}
      >
        -
      </button>
    </div>
  );
}