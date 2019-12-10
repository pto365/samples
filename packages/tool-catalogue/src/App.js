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
import React, { Component, useState, useEffect } from "react";
import { getSearchParametersFromHRef } from "./helpers";
import "./App.css";
import "./css/normalize.css";
import "./css/webflow.css";
import "./css/swimlane-process-map.webflow.css";
import sample from "./sample.json";
import axios from "axios";
import _ from "lodash";

import { AppSuperTile } from "./AppSuperTile";
import { AppFullSizeTile } from "./AppFullSizeTile";

export default function App() {
  const [titlegraphics, setTitlegraphics] = useState("");
  const [tiles, setTiles] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTile, setCurrentTile] = useState(null);
  useEffect(() => {
    var search = getSearchParametersFromHRef(window.location.href);

    var href = search.src
      ? search.src
      : "https://api.jumpto365.com/table/nets.eu/DEX";
    axios.get(href).then(({ data }) => {
      setTitlegraphics(data.titlegraphics);
      var tiles = [];
      if (data.grid) {
        var groups = {};
        var groupRefs = {};
        data.grid.forEach(row => {
          return row.forEach(cell => {
            if (cell.groupSetting) {
              groups[cell.groupSetting.title] = {
                groupSetting: cell.groupSetting,
                members: cell.members
              };
              if (cell.members) {
                cell.members.forEach(id => {
                  var refs = groupRefs[id] ? groupRefs[id] : [];
                  refs.push(cell.groupSetting);
                  groupRefs[id] = refs;
                });
              }
            }
          });
        });

        data.grid.forEach(row => {
          return row.forEach(cell => {
            if (cell.tile && cell.tile.title) {
              var tile = { ...cell.tile };
              var references = groupRefs[cell.id];
              tile.references = references;
              tiles.push(tile);
            }
          });
        });
      }

      setTiles(_.sortBy(tiles, ["title", "href"]));
    });
  }, []);

  return (
    <>
      <img
        style={{
          height: "64px",
          margin: "13px",
          position: "fixed",
          bottom: "0px",
          right: "0px"
        }}
        src={titlegraphics}
      ></img>
       {isZoomed && (
        <div>
          <AppFullSizeTile
            tile={currentTile ? currentTile : tiles ? tiles[0] : null}
            onClose={() => {
              setIsZoomed(false);
            }}
          />
        </div>
      )}
      {!isZoomed && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {tiles.map(tile => {
            return (
              <AppSuperTile
                tile={tile}
                onClick={tile => {
                  setCurrentTile(tile);
                  setIsZoomed(true);
                }}
              />
            );
          })}
        </div>
      )} 
    </>
  );
}
