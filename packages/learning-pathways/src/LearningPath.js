import { loadTheme } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import { loadLearningPath } from "./helpers/LearningPathways";
import _ from "lodash"
import "./App.css"
loadTheme({});
export default function LearningPath() {
  const [errors, setErrors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetIndex, setAssetIndex] = useState({});
  const [technologyIndex, setTechnologyIndex] = useState({});
  const [metadata, setMetadata] = useState([]);
  const [playlists, setPlaylists] = useState([]);
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
    setAssets(data.assets);

    var reducedList = []

      data.playlists.forEach(element => {
        if (reducedList.length < 1000){
          reducedList.push(element)
        }
      });
      setPlaylists(reducedList);
   

    return;

  },[]);

  return (
    <>
 <div style={{ display: "flex" }}>
    <div  style={{ flexGrow: 1,  margin: "20px", maxHeight:"100vh",overflow:"auto" }}>
      {playlists.map(playlist => {
        var tech = technologyIndex[playlist.TechnologyId]
        
       var techText =  tech ?  ` (${tech.Name})` : ""

        return (
          
          


          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 1,  margin: "20px" }}>
              <div style={{ display: "flex" }}>
              <div style={{paddingTop:"30px"}}>
                  <img
                    style={{ height: "180px" }}
                    src={`https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/${playlist.Image}`}
                  ></img>
                </div>
                <div style={{ flexGrow: 1 ,padding:"20px"}}>
                  <div className="ms-fontSize-28"> {playlist.Title} {techText}</div>
                  <div className="ms-fontSize-14"> {playlist.Description}</div>

                  {playlist.Assets &&
                    playlist.Assets.map(assetsId => {
                      var asset = assetIndex[assetsId];
                      return (
                        <>
                          {asset && (
                            <div className="asset" onClick={()=>{
                             
                              setSelectedAsset(asset)}}>

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
      {selectedAsset &&
      <div  style={{ flexGrow: 1,  margin: "20px",minWidth:"50vw" ,position:"sticky",top: "0px"}}>
        {selectedAsset.Title}
        <iframe src={selectedAsset.Url} style={{border:"0px",height:"100vh",width:"100%"}} /> 
      </div>}
      </div>
    </>
  );
}

LearningPath.propTypes = {};
