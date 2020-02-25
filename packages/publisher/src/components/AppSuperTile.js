import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tags } from "./Tags";
import { Highlight } from "./Highlight";
export const AppSuperTile = props => {
  var tile = props.tile ? props.tile : {};
  const [html, setHtml] = useState("");
 
  return (<>
  <div style={{border:"0px dashed grey",margin:10,maxWidth:"300px"}}>
     
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
      if (props.onClick){
        props.onClick(tile);
             }

    }}>
      <div style={{display:"flex"}}><div style={{flexGrow:1}}><Highlight text={tile.title} filter={props.filter} style={props.highlightStyle} /> </div>
      <div style={{alignItems:"flex-end"}}>
      <i
                style={{cursor:"pointer"}}
                  class={props.isPinned ? "ms-Icon ms-Icon--PinnedFill" : "ms-Icon ms-Icon--Pinned"}
                  onClick={(e) => {
                    if (props.onPinnedClicked){
                      e.preventDefault()
                      e.stopPropagation()
                      props.onPinnedClicked(props)
                    }
                    
                  }}
                  aria-hidden="true"
                ></i> 
      </div>
      </div>
      
      <div style={{ textAlign: "center", margin: 20, marginTop:40, height: 120 }}>
        <img style={{ height: "auto", width: 112 }} src={tile.icon} />
      </div>

      <div style={{ maxHeight: 60, height: 60, overflow: "auto" }}>
        {tile.inShort}
      </div>
      <Tags references={tile.references} /> 

    </div>
  </div>
  
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {tile.jumpto && (<a style={{ height: 24 }} className="button" href={tile.jumpto} rel="noopener noreferrer"  target="_blank">
          Jump to
            </a>)}
        {tile.externalArticle && (<a style={{ height: 24 }} className="button" href={tile.externalArticle} rel="noopener noreferrer"  target="_blank">
          Details
            </a>)}
      </div>
  </div></>);
};
AppSuperTile.propTypes = {
  tile: PropTypes.object,
  onClose: PropTypes.func,
  filter : PropTypes.string,
  highlightStyle : PropTypes.object,
  isPinned : PropTypes.bool,
  onPinnedClicked:PropTypes.func
};
