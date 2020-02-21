import { loadTheme } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";
import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton,
  Button
} from "office-ui-fabric-react/lib/Button";
import { ContextualMenu } from "office-ui-fabric-react/lib/ContextualMenu";
import { SpinButton } from "office-ui-fabric-react/lib/SpinButton";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import {
  ComboBox,
  IComboBoxOption,
  SelectableOptionMenuItemType
} from "office-ui-fabric-react/lib/index";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { loadLearningPath } from "./helpers/LearningPathways";
import _ from "lodash";
import "./App.css";
import { Highlight } from "./components/Highlight";
import { set } from "animejs";
import logo from "./media/Logo horizontal color - transparent background.png";
import { Router, Match, Location, navigate, Link } from "@reach/router";
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
loadTheme({});
export default function LearningPath(props) {
  const [errors, setErrors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetIndex, setAssetIndex] = useState({});
  const [technologyIndex, setTechnologyIndex] = useState({});
  const [metadata, setMetadata] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [filter, setFilter] = useState("");
  const [tileSize, setTileSize] = useState(1);
  const [technologyOptions, setTechnologyOptions] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [countVideos, setCountVideos] = useState(0);
  const [showNavigation, setShowNavigation] = useState(true);
  const inFrame = inIframe();
  const [introduced, setIntroduced] = useState(
    localStorage.getItem("introduced")
  );
  const dropdownStyles = {
    dropdown: { width: 300 }
  };
  useEffect(() => {
    const data = require("./helpers/LearningPathways.json");
    var _countVideos = 0;
    var aindex = {};
    data.assets.forEach(asset => {
      aindex[asset.Id] = asset;
    });

    var tindex = {};
    data.metadata.Technologies.forEach(tech => {
      tindex[tech.Id] = tech;
    });
    setMetadata(data.metadata);
    setAssetIndex(aindex);
    setTechnologyIndex(tindex);

    setTechnologyOptions(
      _.sortBy(
        _.keys(tindex).map(t => {
          return { key: tindex[t].Id, text: tindex[t].Name };
        })
      ),
      ["text"]
    );
    setAssets(data.assets);

    var reducedList = [];

    data.playlists.forEach(element => {
      if (element.Assets) {
        _countVideos += element.Assets.length;
      }
      function matchFilter(tile) {
        var match =
          element &&
          element.Title &&
          element.Title.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        if (!match)
          match =
            element &&
            element.Description &&
            element.Description.toLowerCase().indexOf(filter.toLowerCase()) !==
              -1;

        return match;
      }

      var include = true;
      if (include && selectedTechnology) {
        include = element.TechnologyId === selectedTechnology;
      }

      if (include && filter) {
        include = matchFilter(filter);
      }

      if (!include && element.Assets) {
        var assetsHasMatch = false;
        element.Assets.forEach(assetsId => {
          var asset = assetIndex[assetsId];

          if (!assetsHasMatch) {
            assetsHasMatch =
              asset &&
              asset.Title &&
              asset.Title.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          }
        });
      }
      if (!include) return;
      return reducedList.push(element);
      // }
    });
    setCountVideos(_countVideos);
    setPlaylists(reducedList);

    return;
  }, [selectedTechnology, filter]);
  const closeIntroduction = () => {
    localStorage.setItem("introduced", 1);
    setIntroduced(1);
  };
  return (
    <>      {!inFrame && (
      <div
        style={{
          padding: 10,
          xposition: "fixed",
          width: "100%",
          xbottom: 0,
          backgroundColor: "#ffffff",
          height: "24px",
          xborderTop: "1px solid #eeeeee"
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid #eeeeee" }}>
          <div style={{ padding: 4, marginLeft: 16, marginRight: 16 }}>
            <a target="_blank" href="/">
              <img src={logo} style={{ height: "20px" }} />
            </a>
          </div>
          <div
            style={{
              flexGrow: 1,
              fontSize: "20px",
              lineHeight: "20px",
              padding: 2,
              color: "#26569F"
            }}
          >
            {" "}
            Microsoft 365 Learning Videos{" "}
          </div>
          <div
            style={{
              fontSize: "12px",
              lineHeight: "20px",
              padding: 2,
              color: "#26569F"
            }}
          >
            <Link to="/about">About</Link>{" "}
          </div>
        </div>
        {/* {" "}
        Niels Gregers Johansen &nbsp;  */}
      </div>)}
      {!inFrame && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "8px"
          }}
        >
          <div style={{ marginLeft: "16px", flexGrow: 0 }}>
            <Dropdown
              placeholder="Select a technology"
              label="Technology"
              onChanged={(option, index) => {
                setSelectedTechnology(option.key);
              }}
              selectedKey={selectedTechnology}
              options={technologyOptions}
              styles={dropdownStyles}
            />
          </div>
          <div
            style={{
              padding: "0px",

              marginLeft: "8px",
              xmarginRight: "16px",
              flexGrow: 1
            }}
          >
            <TextField
              disabled={showTable}
              label="Filter"
              value={filter}
              onChange={(e, newValue) => {
                setShowNavigation(true);
                setFilter(newValue);
              }}
              placeholder="Start entering a few characters to filter the list of learning videos"
              iconProps={{ iconName: "Filter" }}
            />
          </div>{" "}
          <div
            style={{
              padding: "0px",
              marginTop: 29,
              marginLeft: "8px",
              marginRight: "16px"
            }}
          >
            <Button
              text="Clear"
              onClick={() => {
                setFilter("");
                setSelectedTechnology("");
                setSelectedAsset(null);
                navigate("/");
              }}
            />
          </div>
        </div>
      )}
      <div style={{ display: "flex", borderTop: "1px solid #eeeeee" }}>
        {!inFrame && (
          <>
            {showNavigation && showMap()}
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                borderRight: "1px solid #eeeeee"
              }}
            >
              <i
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowNavigation(!showNavigation);
                }}
                class={`ms-Icon ms-Icon--${
                  showNavigation ? "ChevronLeftSmall" : "ChevronRightSmall"
                }`}
                aria-hidden="true"
              ></i>
            </div>
          </>
        )}
        <div
          style={{
            flexGrow: 1,
            margin: "20px",
            minWidth: "50vw",
            position: "sticky",
            top: "0px"
          }}
        >
          <Match path="/about">
            {props => {
              if (!props.match) return null;

              return (
                <>
                  <h1>Microsoft 365 Learning Videos </h1>

                  <div>
                    Greeting fellow Microsoft 365'ians
                    <p>
                      Here you find a catalogue of {countVideos} videos produced
                      by Microsoft proudly server by this APP crafted by{" "}
                      <a
                        href="https://www.jumpto365.com/about#niels"
                        target="_blank"
                      >
                        Niels Gregers Johansen{" "}
                      </a>
                      &nbsp;. Based on work of{" "}
        <a
          target="_blank"
          href="https://github.com/pnp/custom-learning-office-365/blob/master/LICENSE"
        >
          Patterns and Practices around Microsoft 365 topics
        </a>
                    </p>
                    <h3>Disclaimer</h3>
                    <div>
                      THIS SOLUTION IS PROVIDED AS IS WITHOUT WARRANTY OF ANY
                      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED
                      WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE,
                      MERCHANTABILITY, OR NON-INFRINGEMENT.
                    </div>
                    <h3>Copyright notices</h3>
                    <code>
                      MIT License
                      <br />
                      <br />
                      Copyright (c) 2019 PnP
                      <br />
                      <br />
                      Permission is hereby granted, free of charge, to any
                      person obtaining a copy of this software and associated
                      documentation files (the "Software"), to deal in the
                      Software without restriction, including without limitation
                      the rights to use, copy, modify, merge, publish,
                      distribute, sublicense, and/or sell copies of the
                      Software, and to permit persons to whom the Software is
                      furnished to do so, subject to the following conditions:
                      <br />
                      <br />
                      The above copyright notice and this permission notice
                      shall be included in all copies or substantial portions of
                      the Software.
                      <br />
                      <br />
                      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
                      KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                      WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                      PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
                      OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                      OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                      OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                      SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                      <br />
                      <br />
                    </code>
                  </div>
                </>
              );
            }}
          </Match>

          <Match path="asset/:assetId">
            {props => {
              if (!props || !props.match) {
                return null;
              }
              var asset = assetIndex[props.match.assetId];
              return (
                <div style={{ maxHeight: "100vh", overflow: "auto" }}>
                  {asset && (
                    <div style={{ position: "relative" }}>
                      <div>
                        {" "}
                        <iframe
                          src={asset.Url}
                          style={{
                            border: "0px",
                            height: "90vh",
                            width: "100%"
                          }}
                        />
                      </div>
                      {inFrame && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 1
                          }}
                        >
                          <a href={window.location.href} target="_blank">
                            <i
                              class={`ms-Icon ms-Icon--OpenInNewWindow`}
                              aria-hidden="true"
                            ></i>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {!asset && <div>Not found</div>}
                </div>
              );
            }}
          </Match>
        </div>
      </div>
    </>
  );

  function showMap() {
    return (
      <div
        style={{
          flexGrow: 1,
          margin: "20px",
          maxHeight: "90vh",
          overflow: "auto"
        }}
      >
        {playlists.map(playlist => {
          var tech = technologyIndex[playlist.TechnologyId];
          var techText = tech ? ` (${tech.Name})` : "";
          const highlightStyle = {
            backgroundColor: "yellow",
            color: "#333"
          };
          return (
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1, margin: "20px" }}>
                <div style={{ display: "flex" }}>
                  <div style={{ paddingTop: "30px" }}>
                    <img
                      style={{ height: "10vw" }}
                      src={`https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/${playlist.Image}`}
                    ></img>
                  </div>
                  <div style={{ flexGrow: 1, padding: "20px" }}>
                    <div className="ms-fontSize-28" style={{ marginTop: 4 }}>
                      {" "}
                      <Highlight
                        text={playlist.Title}
                        filter={filter}
                        style={{
                          backgroundColor: "yellow",
                          color: "#333"
                        }}
                      />
                    </div>
                    <div
                      className="ms-fontSize-14"
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      {" "}
                      <Highlight
                        text={playlist.Description}
                        filter={filter}
                        style={highlightStyle}
                      />
                    </div>
                    <ul>
                      {playlist.Assets &&
                        playlist.Assets.map(assetsId => {
                          var asset = assetIndex[assetsId];
                          return (
                            <>
                              {asset && (
                                <li
                                  className="asset"
                                  onClick={() => {
                                    setSelectedAsset(asset);

                                    navigate("/asset/" + asset.Id);
                                  }}
                                >
                                  <Highlight
                                    text={asset.Title}
                                    filter={filter}
                                    style={highlightStyle}
                                  />
                                </li>
                              )}
                            </>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

LearningPath.propTypes = {};
