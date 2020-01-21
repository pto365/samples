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
import axios from "axios";
import _ from "lodash";

import { AppSuperTile } from "./components/AppSuperTile";
import { AppFullSizeTile } from "./components/AppFullSizeTile";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { initializeIcons } from "@uifabric/icons";

import OfficeGraph from "./helpers/OfficeGraph";
import { PivotItem, Pivot } from "office-ui-fabric-react/lib/Pivot";
import { ViewErrors } from "./components/ViewErrors";
import { ViewTeams } from "./components/ViewTeams";
import {
  DefaultButton,
  PrimaryButton,
  Stack,
  IStackTokens
} from "office-ui-fabric-react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";
import { ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import {
  CommandBar,
  ICommandBarItemProps
} from "office-ui-fabric-react/lib/CommandBar";

import Animejs from "animejs";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import ToolboxLayout from "./components/ToolboxLayout";
import { ErrorCacheKeys } from "msal/lib-commonjs/utils/Constants";
initializeIcons();

export default function App() {
  const [titlegraphics, setTitlegraphics] = useState("");
  const [filter, setFilter] = useState("");
  const [tiles, setTiles] = useState([]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTile, setCurrentTile] = useState(null);
  const [me, setMe] = useState({});
  const [ztickyFolder, setZtickyFolder] = useState({});
  const [myTools, setMyTools] = useState([]);
  const [ztickyRef, setZtickyRef] = useState("");
  const [errors, setErrors] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [siteUrlLabel, setSiteUrlLabel] = useState("");
  const [siteUrlHref, setSiteUrlHref] = useState("");
  const [refreshing, setRefresing] = useState(false);
  const [progress, setProgress] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [editingLayout, setEditingLayout] = useState(true);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tableUrl, setTableUrl] = useState("");
  const [layouts, setLayouts] = useState({});
  const [currentPivot, setCurrentPivot] = useState("pinned");
  const addTile = tile => {
    setProgress("Adding pin");
    OfficeGraph.addTile(ztickyFolder, tile)
      .then(async folder => {
        try {
          
          // var myTools = await OfficeGraph.getMyTools(ztickyFolder, true);
          myTools.push(folder)
          
          var keys = _.keys(layouts)
          keys.forEach(key => {
            layouts[key].push(
              {
                x: 0,
                y: Infinity,
                w:3,
                h:3,
               
                i: layouts[key].length.toString(),

                static: 0 //Math.random() < 0.05,
              }

            )
          });
          setLayouts(layouts)
          
          //
          setMyTools(myTools);
        } catch (error) {
          errors.push({ context: "AddTile > myTools.push() ", error });
          setErrors(errors);
        }
        // myTools.forEach(tool=>{

        // })
        // debugger
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.addTile()", error });
        setErrors(errors);
      })
      .finally(() => {
        setProgress("");
      });
    // db.table('myTiles')
    //   .add(tile)
    //   .then((id) => {
    //     const newList = [...myTiles, Object.assign({}, tile, { id })];
    //     setMyTiles(newList)
    //   });
  };

  useEffect(() => {
    // db.table("myTiles").toArray().then(tiles=>{setMyTiles(tiles)})
    initGraph();
    OfficeGraph.me()
      .then(userDetails => {
        setMe(userDetails);
        window.document.title = userDetails.displayName + " Tools";
      })
      .catch(error => {
        errors.push({ context: "OfficeGraph.me()", error });
        setErrors(errors);
      });
    var search = getSearchParametersFromHRef(window.location.href);
    if (search.ztickyref) {
      setZtickyRef(search.ztickyref);
    }
    var href = search.src
      ? search.src
      : "https://api.jumpto365.com/table/hexatown.com/PTO365";
    setTableUrl("https://pro.jumpto365.com/@/hexatown.com/PTO365");
    readGrid(href, "hexatown.com/PTO365");
  }, []);

  function readGrid(href, tableId) {
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
              tile.tableId = tableId;
              tile.correlation =
                href +
                "#" +
                (tile.key
                  ? tile.key
                  : tile.title
                  ? tile.title.toLowerCase()
                  : tile.id);
              var references = groupRefs[cell.id];
              tile.references = references;
              tiles.push(tile);
            }
          });
        });
      }
      setTiles(_.sortBy(tiles, ["title", "href"]));
    });
  }

  async function initGraph(refresh) {
    try {
      if (refresh) {
        localStorage.removeItem("memberships");
        localStorage.removeItem("mytools");
      }
      var queueCount = 0;

      setRefresing(true);

      await OfficeGraph.initStorage();

      // var cachedMemberships = localStorage.getItem("memberships");
      // if (cachedMemberships && !refresh) {
      //   setMemberships(JSON.parse(cachedMemberships));
      // } else {
      //   queueCount ++
      //   OfficeGraph.teamMemberships()
      //     .then(memberships => {
      //       localStorage.setItem("memberships", JSON.stringify(memberships));
      //       queueCount --
      //       if (queueCount===0) setRefresing(false)
      //       setMemberships(memberships);
      //     })
      //     .catch(error => {
      //       queueCount --
      //       if (queueCount<=0) setRefresing(false)
      //       errors.push({ context: "OfficeGraph.teamMemberships()", error });
      //       setErrors(errors);
      //     });
      // }

      OfficeGraph.initTileStorage()
        .then(async ztickyFolder => {
          setZtickyFolder(ztickyFolder);
          queueCount++;
         
          var [layouts,properties,version] = await OfficeGraph.readLayouts(ztickyFolder);
          //debugger
          var myTools = []
          if (version < 0){
            var tileFolders = await OfficeGraph.getMyTools(ztickyFolder, refresh);
            myTools =  tileFolders.map(folder=>{
  
              return {title: folder.tile ? folder.tile.title : folder.name, tile:folder.tile}
            })
          }else{
            
            myTools = properties.tiles.map(tile=>{
              
              if (!tile) return null
              
              return {title:tile.title,tile}
            })

          }
         


          queueCount--;
          if (queueCount === 0) setRefresing(false);
          setMyTools(myTools);
          setLayouts(layouts);
        })
        .catch(error => {
          queueCount--;
          if (queueCount <= 0) setRefresing(false);
          errors.push({ context: "OfficeGraph.initStorage()", error });
          setErrors(errors);
        });
    } catch (error) {
      errors.push({ context: "initGraph", error });
      setErrors(errors);
    }
  }

  function matchFilter(tile) {
    var match = tile &&
      tile.title &&
      tile.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    if (!match)
      match = tile &&
        tile.inShort &&
        tile.inShort.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    if (!match)
      match =tile &&
        tile.subTitle &&
        tile.subTitle.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

    return match;
  }

  function matchTeam(team) {
    var details = team.data && team.data.details ? team.data.details : {};
    var channels = team.data && team.data.channels ? team.data.channels : [];
    var match =
      details.displayName &&
      details.displayName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    if (!match)
      match =
        details.description &&
        details.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    channels.forEach(channel => {
      if (!match) {
        match =
          channel.displayName &&
          channel.displayName.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1;
      }
      if (!match) {
        match =
          channel.description &&
          channel.description.toLowerCase().indexOf(filter.toLowerCase()) !==
            -1;
      }
    });

    return match;
  }
  function persistLayouts(layouts) {
    setLayouts(layouts);
    var tiles = myTools.map(tool=>{return tool.tile})
    OfficeGraph.writeLayouts(ztickyFolder, layouts,{tiles})
      .then()
      .catch(error => {
        errors.push({ context: "  OfficeGraph.writeLayouts()", error });
        setErrors(errors);
      });
  }

  var filteredTiles = !filter ? tiles : [];
  var filteredMyTools = !filter ? myTools : [];
  var filteredMemberShips = !filter ? memberships : [];
  var filteredSiteLinks = !filter ? [] : [];
  var siteUrl = ztickyRef ? new URL(ztickyRef) : null;
  if (filter) {
    tiles.forEach(tile => {
      if (matchFilter(tile)) {
        filteredTiles.push(tile);
      }
    });
    myTools.forEach(folder => {
      if (matchFilter(folder.tile)) {
        filteredMyTools.push(folder);
      }
    });

    memberships.forEach(team => {
      if (matchTeam(team)) {
        filteredMemberShips.push(team);
      }
    });
  }

  const dropdownStyles = {
    dropdown: { width: 300 }
  };
  return (
    <div>
      {/* <CommandBar
        // items={_items}
        // overflowItems={_overflowItems}
        // overflowButtonProps={overflowProps}
        farItems={[
          // {
          //   key: "tile",
          //   text: "Grid view",
          //   // This needs an ariaLabel since it's icon-only
          //   ariaLabel: "Filter view",
          //   iconOnly: true,
          //   iconProps: { iconName: "Filter" },
          //   onClick: () => {
          //     if (showFilterOptions) {
          //       setFilter("");
          //     }
          //     setShowFilterOptions(!showFilterOptions);
          //   }
          // }
        ]}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      /> */}
      <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
        {" "}
        {progress && (
          <div
            style={{
              backgroundColor: "white",
              width: "100vw",
              position: "fixed",
              top: "0px"
            }}
          >
            <ProgressIndicator xlabel="Example title" description={progress} />
          </div>
        )}
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
          <div style={{ display: "flex" }}>
            {" "}
            <div
              style={{
                paddingRight: "8px",
                position: "fixed",
                bottom: "0px",
                backgroundColor: "white"
              }}
            >
              <a href={ztickyFolder.webUrl} target="_blank">
                <i
                  style={{
                    cursor: "pointer",
                    padding: "4px",
                    color: "black"
                  }}
                  class="ms-Icon ms-Icon--OpenFolderHorizontal"
                  aria-hidden="true"
                ></i>{" "}
              </a>
              <i
                style={{ cursor: "pointer", padding: "4px" }}
                class="ms-Icon ms-Icon--Refresh"
                onClick={() => {
                  initGraph(true);
                }}
                aria-hidden="true"
              ></i>{" "}
              {refreshing && <>Loading</>}
            </div>
            <div style={{ flexGrow: "1" }}>
              <Pivot style={{ padding: "0px" }} selectedKey={currentPivot}
                                 onLinkClick={(e,pivot,x)=>{
                                  // debugger
                                  // setCurrentPivot(pivot.key)
                                }}
              
              >
                {filteredMyTools.length > 0 && (
                  <PivotItem
 
                    key="pinned"
                    headerText="Pinned"
                    itemCount={filteredMyTools.length}
                  >
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {filteredMyTools.map((folder, key) => {
                          var tile = folder.tile
                            ? folder.tile
                            : {
                                title: folder.name,
                                color: "#dddddd"
                              };
                          return (
                            <AppSuperTile
                              isPinned={true}
                              key={key}
                              tile={tile}
                              filter={filter}
                              highlightStyle={{ backgroundColor: "yellow" }}
                              onClick={tile => {
                                // addTile(tile)
                               
                                if (tile.jumpto){
                                  return window.open(tile.jumpto,"_blank")
                                }
                                setCurrentTile(tile);
                                setIsZoomed(true);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </PivotItem>
                )}
                {/* {siteUrl && (
                  <PivotItem
                    headerText="Site"
                    itemCount={filteredSiteLinks.length}
                  >
                    <h3>Which tools do you find good for this site?</h3>
                    <div>{siteUrl.hostname}</div>
                    <TextField
                      label="Label"
                      placeholder="Enter label for this link"
                      value={siteUrlLabel}
                      onChange={(e, value) => {
                        setSiteUrlLabel(value);
                      }}
                    ></TextField>
                    <TextField
                      label="URL"
                      placeholder="Enter URL"
                      value={siteUrlHref}
                      onChange={(e, value) => {
                        setSiteUrlHref(value);
                      }}
                    ></TextField>
                    <PrimaryButton
                      text="Share link"
                      disabled={!siteUrlHref && !siteUrlLabel ? true : false}
                    />
                  </PivotItem>
                )} */}
                <PivotItem
                key="catalogue"
                  headerText="Catalogue"
                  itemCount={filteredTiles.length}
                >
                  <div style={{ display: "flex", marginTop: "8px" }}>
                    <div style={{ marginLeft: "16px", flexGrow: 0 }}>
                      <Dropdown
                        placeholder="Select an area"
                        label="Area"
                        onChanged={(option, index) => {
                          readGrid(option.key.api, option.key.id);
                          setTableUrl(option.key.web);
                          //debugger
                        }}
                        xselectedKey="https://api.jumpto365.com/table/hexatown.com/PTO365"
                        options={[
                          {
                            key: "fruitsHeader",
                            text: "Nets Group Periodic Tables",
                            itemType: DropdownMenuItemType.Header
                          },
                          {
                            key: {
                              id: "nets.eu/2019-q4",
                              api:
                                "https://api.jumpto365.com/table/nets.eu/2019-q4",
                              web: "https://pro.jumpto365.com/@/nets.eu/2019-q4"
                            },
                            text: "One Tenant - Wave 1"
                          },
                          {
                            key: {
                              id: "nets.eu/digital-workplace",
                              api:
                                "https://api.jumpto365.com/table/nets.eu/digital-workplace",
                              web:
                                "https://pro.jumpto365.com/@/nets.eu/digital-workplace"
                            },
                            text: "Digital Workplace"
                          },
                          {
                            key: {
                              id: "nets.eu/group-tech-highlevel",
                              api:
                                "https://api.jumpto365.com/table/nets.eu/group-tech-highlevel",
                              web:
                                "https://pro.jumpto365.com/@/nets.eu/group-tech-highlevel"
                            },
                            text: "Group Tech Playbook"
                          },

                          {
                            key: "divider_1",
                            text: "-",
                            itemType: DropdownMenuItemType.Divider
                          },
                          {
                            key: "jumpto365",
                            text: "Generic Periodic Tables",
                            itemType: DropdownMenuItemType.Header
                          },
                          {
                            key: {
                              id: "hexatown.com/PTO365",
                              api:
                                "https://api.jumpto365.com/table/hexatown.com/PTO365",
                              web:
                                "https://pro.jumpto365.com/@/hexatown.com/PTO365"
                            },
                            text: "Office 365"
                          },
                          {
                            key: {
                              id: "jumpto365.com/ems5",
                              api:
                                "https://api.jumpto365.com/table/jumpto365.com/ems5",
                              web:
                                "https://pro.jumpto365.com/@/jumpto365.com/ems5"
                            },
                            text: "EMS"
                          }
                          //{ key: 'https://raw.githubusercontent.com/hexatown/docs/master/contexts/ai/index.json', text: 'AI' }
                        ]}
                        styles={dropdownStyles}
                      />
                    </div>
                    <div style={{ padding: "0px",marginLeft:"8px",flexGrow:1 }}>
                  <TextField
                  style={{maxWidth:"300px"}}
                    label="Filter"
                    value={filter}
                    onChange={(e, newValue) => {
                      setFilter(newValue);
                    }}
                    placeholder="Filter the list of tools"
                    iconProps={{ iconName: "Filter" }}
                  />
                </div>
                    {" "}
                    <div style={{ marginLeft: "16px" }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ padding: "8px" }}>Table view</div>
                        <div>
                          <Toggle
                            xlabel="Show Table"
                            checked={showTable}
                            style={{ marginTop: "8px" }}
                            xonText="Table view On"
                            xoffText="Table view Off"
                            onChange={(e, checked) => {
                              setShowTable(checked);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {showTable && (
                    <>
                      {tableUrl}
                      <iframe
                        style={{
                          height: "calc(100vh - 300px",
                          width: "calc(100vw - 100px"
                        }}
                        src={tableUrl}
                      ></iframe>
                    </>
                  )}
                  {!showTable && (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {filteredTiles.map((tile, key) => {
                        return (
                          <AppSuperTile
                            key={key}
                            filter={filter}
                            highlightStyle={{ backgroundColor: "yellow" }}
                            tile={tile}
                            onPinnedClicked={props => {
                              if (props.tile) {
                                addTile(props.tile);
                              }
                            }}
                            onClick={tile => {
                              if (tile.jumpto){
                                return window.open(tile.jumpto,"_blank")
                              }
                              setCurrentTile(tile);
                              setIsZoomed(true);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </PivotItem>
                {memberships.length > 0 && (
                  <PivotItem
                    headerText="Teams"
                    itemCount={filteredMemberShips.length}
                  >
                    <ViewTeams
                      memberShips={filteredMemberShips}
                      filter={filter}
                      highlightStyle={{ backgroundColor: "yellow" }}
                    />
                  </PivotItem>
                )}
                {false && myTools.length > 0 && 
                <PivotItem headerText="Grid"  key="grid">
                  <div>
                  <div style={{ display: "flex", marginTop: "8px" }}>
                    <div style={{ marginLeft: "16px", flexGrow: 1 }}>
                      
                      
                    </div>
                    <div style={{ marginLeft: "16px" }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ padding: "8px" }}>Edit Layout</div>
                        <div>
                          <Toggle
                          
                            checked={editingLayout}
                            style={{ marginTop: "8px" }}
                          
                            onChange={(e, checked) => {
                              setEditingLayout(checked);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                    <ToolboxLayout
                      tools={myTools}
                      layouts={layouts}
                      persist={persistLayouts}
                      editingLayout={editingLayout}
                      onTileClick={tile => {
                        setCurrentTile(tile);
                        setIsZoomed(true);
                      }}
                    />
                  </div>
                </PivotItem>}
                {errors.length !== 0 && (
                  <PivotItem
                    headerText="Developer feedback"
                    itemCount={errors.length}
                  >
                    <div>
                      <ViewErrors errors={errors} />
                    </div>
                  </PivotItem>
                )}
              </Pivot>
            </div>
            {showFilterOptions && (
              <div
                style={{
                  borderLeft: "1px solid #dddddd",
                  borderTop: "1px solid #dddddd",
                  padding: "8px",
                  float: "right",
                  minWidth: "300px"
                }}
              >
                <div style={{ padding: "0px" }}>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
