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
import logo from "./media/Logo horizontal color - transparent background.png"
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
  const [countVideos, setCountVideos] = useState(0);
  const [showNavigation, setShowNavigation] = useState(true);
  const [introduced, setIntroduced] = useState(
    localStorage.getItem("introduced")
  );
  const dropdownStyles = {
    dropdown: { width: 300 }
  };
  useEffect(() => {
    const data = require("./helpers/LearningPathways.json");
    var _countVideos = 0
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
      if (element.Assets ){
        _countVideos += element.Assets.length
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
    setCountVideos(_countVideos)
    setPlaylists(reducedList);

    return;
  }, [selectedTechnology, filter]);
  const closeIntroduction = () => {
    localStorage.setItem("introduced", 1);
    setIntroduced(1);
  };
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
            style={{ maxWidth: "300px" }}
            label="Filter"
            value={filter}
            onChange={(e, newValue) => {
              setShowNavigation(true)
              setFilter(newValue);
            }}
            placeholder="Filter the list of learning videos"
            iconProps={{ iconName: "Filter" }}
          />
        </div>{" "}
<div  style={{
            padding: "0px",
            marginTop:29,
            marginLeft: "8px",
            marginRight: "16px",
           
          }}>
<Button text="Clear" onClick={()=>{setFilter("");setSelectedTechnology("");setSelectedAsset(null)}}/>

</div>
      </div>
      <div style={{ display: "flex",borderTop:"1px solid #eeeeee" }}>
        {showNavigation &&
        showMap()
       }
       <div  style={{
             
              marginTop: "20px",
              padding:"10px",
              borderRight:"1px solid #eeeeee"
              
            
            }}>
       <i style={{cursor:"pointer"}} onClick={()=>{setShowNavigation(!showNavigation)}}
       class={`ms-Icon ms-Icon--${showNavigation?"ChevronLeftSmall":"ChevronRightSmall"}`} aria-hidden="true"></i>
       </div>
          <div
            style={{
              flexGrow: 1,
              margin: "20px",
              minWidth: "50vw",
              position: "sticky",
              top: "0px"
            }}
          >
            {selectedAsset && (
            <iframe
              src={selectedAsset.Url}
              style={{ border: "0px", height: "100vh", width: "100%" }}
            />)}
                {!selectedAsset && (
                  <>
           <h1>Microsoft 365 learning pathways </h1>
           
           
           <div>
             Greeting fellow Microsoft 365'ians
             <p>
Here you find a catalogue of {countVideos} videos produced by Microsoft

             </p>
           </div>
           <div style={{position:"fixed",bottom:50}}>
           <h2>ZTICKYBAR Learning Paths - version 0.1</h2>
           <img src={logo} style={{width:"10vw"}}/>
          
           <h3>Disclaimer</h3>
            <div>
THIS SOLUTION IS PROVIDED AS IS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.


</div></div></>
           )}
          </div>
        
      </div>
      <div>
        <Dialog
          hidden={introduced === "1"}
          onDismiss={closeIntroduction}
          dialogContentProps={{
            type: DialogType.normal,
            title: "ZTICKYBAR Learning Path",
            subText: "Implementation of Microsoft 365 learning pathways"
          }}
          modalProps={{
            isBlocking: true,
            styles: { main: { maxWidth: 450 } },
            dragOptions: {
              moveMenuItemText: "Move",
              closeMenuItemText: "Close",
              menu: ContextualMenu
            }
          }}
        >
          <p>
            {" "}
            Easy embedable Comprehensive end user training content: product and
            scenario-based training, in video and article format
          </p>
          <p>
            Always up-to-date content: As Office 365 changes, the Microsoft 365
            learning pathways content will be updated. Content updates will be
            made and communicated to customers on a monthly basis
          </p>
          <DialogFooter>
            <PrimaryButton onClick={closeIntroduction} text="OK" />
          </DialogFooter>
        </Dialog>
      </div>


      
      <div style={{padding:10, position:"fixed",width:"100%", bottom:0,backgroundColor:"#ffffff",height:"24px",borderTop:"1px solid #eeeeee"}}>
      &copy; 2020 <a target="_blank" href="https://www.jumpto365.com">www.jumpto365.com</a> Niels Gregers Johansen
          &nbsp; Based on work of <a target="_blank"  href="https://github.com/pnp/custom-learning-office-365/blob/master/LICENSE">Patterns and Practices around Microsoft 365 topics</a>
      </div>
    </>
  );

  function showMap() {
    return <div style={{
      flexGrow: 1,
      margin: "20px",
      maxHeight: "100vh",
      overflow: "auto"
    }}>
      {playlists.map(playlist => {
        var tech = technologyIndex[playlist.TechnologyId];
        var techText = tech ? ` (${tech.Name})` : "";
        const highlightStyle = {
          backgroundColor: "yellow",
          color: "#333"
        };
        return (<div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1, margin: "20px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ paddingTop: "30px" }}>
                <img style={{ height: "10vw" }} src={`https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/${playlist.Image}`}></img>
              </div>
              <div style={{ flexGrow: 1, padding: "20px" }}>
                <div className="ms-fontSize-28" style={{ marginTop: 4 }}>
                  {" "}
                  <Highlight text={playlist.Title} filter={filter} style={{
                    backgroundColor: "yellow",
                    color: "#333"
                  }} />
                </div>
                <div className="ms-fontSize-14" style={{ marginTop: 10, marginBottom: 10, }}>
                  {" "}
                  <Highlight text={playlist.Description} filter={filter} style={highlightStyle} />
                </div>
                <ul>
                  {playlist.Assets &&
                    playlist.Assets.map(assetsId => {
                      var asset = assetIndex[assetsId];
                      return (<>
                        {asset && (<li className="asset" onClick={() => {
                          setSelectedAsset(asset);
                        } }>
                          <Highlight text={asset.Title} filter={filter} style={highlightStyle} />
                        </li>)}
                      </>);
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>);
      })}
    </div>;
  }
}

LearningPath.propTypes = {};
