import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tags } from "./Tags";
export const AppSuperTile = props => {
  var tile = props.tile ? props.tile : {};
  const [html, setHtml] = useState("");
 
  return (<>
  <div style={{border:"0px dashed grey",margin:10}}>
     
  <div style={{
    margin: 10,
    padding: 10,
    backgroundColor: tile.color,
    color: tile.textcolor,
    width: 300,
    height: 300,
    maxHeight: 300,
    overflow: "auto"
  }}>
    <div style={{ cursor: "pointer" }} onClick={() => {
      if (props.onClick)
        props.onClick(tile);
    }}>
      <div>{tile.title}</div>
   
      <div style={{ textAlign: "center", height: 120, margin: 20 }}>
        <img style={{ height: "auto", width: 80 }} src={tile.icon} />
      </div>

      <div style={{ maxHeight: 80, height: 80, overflow: "auto" }}>
        {tile.inShort}
      </div>


    </div>
  </div>
  <Tags references={tile.references} />
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {tile.jumpto && (<a style={{ height: 24 }} className="button" href={tile.jumpto} target="_blank">
          Jump to
            </a>)}
        {tile.externalArticle && (<a style={{ height: 24 }} className="button" href={tile.externalArticle} target="_blank">
          Details
            </a>)}
      </div>
  </div></>);
};
AppSuperTile.propTypes = {
  tile: Object,
  onClose: PropTypes.func
};
