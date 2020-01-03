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

import { AppSuperTile } from "./components/AppSuperTile";
import { AppFullSizeTile } from "./components/AppFullSizeTile";
import {
  TextField,
  MaskedTextField
} from "office-ui-fabric-react/lib/TextField";
import { initializeIcons } from "@uifabric/icons";
import db from "./db";
import OfficeGraph from "./helpers/OfficeGraph";
import {
  PivotItem,
  IPivotItemProps,
  Pivot
} from "office-ui-fabric-react/lib/Pivot";
initializeIcons();

export default function App() {
  const [titlegraphics, setTitlegraphics] = useState("");
  const [filter, setFilter] = useState("");
  const [tiles, setTiles] = useState([]);
  const [myTiles, setMyTiles] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTile, setCurrentTile] = useState(null);
  const [me, setMe] = useState({});
  const [ztickyFolder, setZtickyFolder] = useState({});
  const [myTools, setMyTools] = useState([]);

  const addTile = tile => {
    OfficeGraph.addTile(ztickyFolder, tile);
    // db.table('myTiles')
    //   .add(tile)
    //   .then((id) => {
    //     const newList = [...myTiles, Object.assign({}, tile, { id })];
    //     setMyTiles(newList)
    //   });
  };

  useEffect(() => {
    // db.table("myTiles").toArray().then(tiles=>{setMyTiles(tiles)})
    OfficeGraph.initStorage()
      .then(async ztickyFolder => {
        setZtickyFolder(ztickyFolder);
        var myTools = await OfficeGraph.getMyTools(ztickyFolder)
        
        setMyTools(myTools)
      })
      .catch(error => {
        debugger;
      });
    OfficeGraph.me()
      .then(userDetails => {
        setMe(userDetails);
        window.document.title = userDetails.displayName + " Tools";
      })
      .catch(error => {
        debugger;
      });
    var search = getSearchParametersFromHRef(window.location.href);

    var href = search.src
      ? search.src
      : "https://api.jumpto365.com/table/hexatown.com/PTO365";
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
        <>
          <div style={{ padding: "20px" }}>
            <TextField
              label="Filter"
              value={filter}
              onChange={(e, newValue) => {
                setFilter(newValue);
              }}
              placeholder="Filter the list of tools"
              iconProps={{ iconName: "Filter" }}
            />
          </div>

          <Pivot style={{ padding: "20px" }}>
            <PivotItem headerText="My Tools" itemCount={myTools.length}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {myTools.map(folder => {
                  var tile = folder.tile ? folder.tile: {
                    title:folder.name,
                    color: "#dddddd"
                  }
                  return (
                    <AppSuperTile
                     
                      tile={tile}
                      onClick={tile => {
                        // addTile(tile);
                        // setCurrentTile(tile);
                        // setIsZoomed(true);
                      }}
                    />
                  );
                })}
              </div>



            </PivotItem>
            <PivotItem headerText="Site Tools">
              
              <h3>Which tools do you find good for this site?</h3>
              </PivotItem>
            <PivotItem headerText="Global Tools" itemCount={tiles.length}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {tiles.map(tile => {
                  if (filter) {
                    var match =
                      tile.title &&
                      tile.title.toLowerCase().indexOf(filter.toLowerCase()) !==
                        -1;
                    if (!match)
                      match =
                        tile.inShort &&
                        tile.inShort
                          .toLowerCase()
                          .indexOf(filter.toLowerCase()) !== -1;
                    if (!match)
                      match =
                        tile.subTitle &&
                        tile.subTitle
                          .toLowerCase()
                          .indexOf(filter.toLowerCase()) !== -1;
                    if (!match) return null;
                  }
                  return (
                    <AppSuperTile
                      filter={filter}
                      tile={tile}
                      onClick={tile => {
                        addTile(tile);
                        setCurrentTile(tile);
                        setIsZoomed(true);
                      }}
                    />
                  );
                })}
              </div>
            </PivotItem>
          </Pivot>
        </>
      )}
    </>
  );
}
