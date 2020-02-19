import { loadTheme } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { loadLearningPath } from "./helpers/LearningPathways";
import _ from "lodash";
import "./App.css";
import { Highlight } from "./components/Highlight";
loadTheme({});
export default function LearningPath() {
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

  const dropdownStyles = {
    dropdown: { width: 300 }
  };
  useEffect(() => {
    const data = require("./helpers/LearningPathways.json");
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
      function matchFilter(tile) {
        var match =
        element &&
        element.Title &&
        element.Title.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        if (!match)
          match =
          element &&
          element.Description &&
          element.Description.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        // if (!match)
        //   match =
        //   element &&
        //   element.subTitle &&
        //   element.subTitle.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    
        return match;
      }
      // if (reducedList.length < 1000) {
     
      var include = true
      if (include && selectedTechnology) {
        include = element.TechnologyId === selectedTechnology
      }

      if (include && filter){
        include = matchFilter(filter)
      }
      if (!include) return
      return reducedList.push(element);
      // }
    });
    setPlaylists(reducedList);

    return;
  }, [selectedTechnology,filter]);

  return (
    <>
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
              // readGrid(option.key.api, option.key.id);
              // setTableUrl(option.key.web);
              // setTableApiSelected(option.key.api);
              // setSelectedGroup("");
              //debugger
            }}
            options={technologyOptions}
            styles={dropdownStyles}
          />
        </div>
        <div style={{ padding: "0px", marginLeft: "8px",marginRight: "16px", flexGrow: 1 }}>
          <TextField
            disabled={showTable}
            style={{ maxWidth: "300px" }}
            label="Filter"
            value={filter}
            onChange={(e, newValue) => {
              setFilter(newValue);
            }}
            placeholder="Filter the list of learning videos"
            iconProps={{ iconName: "Filter" }}
          />
        </div>{" "}
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            flexGrow: 1,
            margin: "20px",
            maxHeight: "100vh",
            overflow: "auto"
          }}
        >
          {playlists.map(playlist => {
            var tech = technologyIndex[playlist.TechnologyId];

            var techText = tech ? ` (${tech.Name})` : "";

            return (
              <div style={{ display: "flex" }}>
                <div style={{ flexGrow: 1, margin: "20px" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ paddingTop: "30px" }}>
                      <img
                        style={{ height: "180px" }}
                        src={`https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/${playlist.Image}`}
                      ></img>
                    </div>
                    <div style={{ flexGrow: 1, padding: "20px" }}>
                      <div className="ms-fontSize-28">
                        {" "}
                        <Highlight text={playlist.Title} filter={filter} style={{
                                backgroundColor: "yellow",
                                color: "#333"
                              }} /> 
                        {techText}
                      </div>
                      <div className="ms-fontSize-14">
                        {" "}
                        {playlist.Description}
                      </div>

                      {playlist.Assets &&
                        playlist.Assets.map(assetsId => {
                          var asset = assetIndex[assetsId];
                          return (
                            <>
                              {asset && (
                                <div
                                  className="asset"
                                  onClick={() => {
                                    setSelectedAsset(asset);
                                  }}
                                >
                                  {asset.Title}
                                </div>
                              )}
                            </>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedAsset && (
          <div
            style={{
              flexGrow: 1,
              margin: "20px",
              minWidth: "50vw",
              position: "sticky",
              top: "0px"
            }}
          >
            {selectedAsset.Title}
            <iframe
              src={selectedAsset.Url}
              style={{ border: "0px", height: "100vh", width: "100%" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

LearningPath.propTypes = {};
