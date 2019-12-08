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
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import PropTypes from "prop-types";

const Tags = props =>{
  
  if ( props && props.references ){
    return (
      <div className="tags" style={{display:"flex"}}>
        {props.references.map(group => {
        
          return <div style={{ padding:"4px",margin:"4px", backgroundColor: group.color,color:group.textColor }}>
            {group.title}
          </div>;
        })}
      </div>
    )}
    else{return null}
  
}
Tags.propTypes = {
  references: PropTypes.array
 
};
const AppSuperTile = props => {
  var tile = props.tile ? props.tile : {};
  const [html, setHtml] = useState("");

  return (
    <div
      style={{
        margin: 10,
        padding: 10,
        backgroundColor: tile.color,
        color: tile.textcolor,
        width: 300,
        height: 300,
        maxHeight: 300,
        overflow: "auto"
      }}
    >
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (props.onClick) props.onClick(tile);
        }}
      >
        <div>{tile.title}</div>
        <Tags references={tile.references}/>
        <div style={{ textAlign: "center", height: 120, margin: 20 }}>
          <img style={{ height: "auto", width: 80 }} src={tile.icon} />
        </div>

        <div style={{ maxHeight: 80, height: 80, overflow: "auto" }}>
          {tile.inShort}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {tile.jumpto && (
            <a
              style={{ height: 24 }}
              className="button"
              href={tile.jumpto}
              target="_blank"
            >
              Jump to
            </a>
          )}
          {tile.externalArticle && (
            <a
              style={{ height: 24 }}
              className="button"
              href={tile.externalArticle}
              target="_blank"
            >
              Details
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

AppSuperTile.propTypes = {
  tile: Object,
  onClose: PropTypes.func
};
const AppFullSizeTile = props => {
  var tile = props.tile ? props.tile : {};
  const [html, setHtml] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    if (tile.contentRef) {
      axios
        .get(tile.contentRef)
        .then(result => {
          var converter = new QuillDeltaToHtmlConverter(result.data.ops);
          setHtml(converter.convert());
        })
        .catch(error => {
          if (error.response.status !== 404) {
            setError(error.message);
          }
        });
    }
  });

  return (
    <>
      {error && <div>{error}</div>}
      <div
        onClick={props.onClose}
        style={{
          backgroundColor: tile.color,
          color: tile.textcolor,
          width: "100vw",
          height: "100vh",

          overflow: "auto"
        }}
      >
        <div>
          <div style={{ display: "flex" }}>
            <div>
              {" "}
              <img
                style={{ margin: "1vh", height: "10vh", width: "auto" }}
                src={tile.icon}
              />
            </div>
            <div style={{ height: "10vh", width: "auto" }}>
              <div
                className="fullSizeHeading"
                style={{
                  padding: "3vh",
                  fontSize: "5vh",
                  textOverflow: "nowrap",
                  whiteSpace: "no-wrap"
                }}
              >
                {tile.title}
              </div>
              <div
                className="fullSizeDescription"
                style={{ paddingLeft: "3vh", fontSize: "3vh" }}
              >
                {tile.inShort}
              </div>
            </div>
          </div>

          <div
            style={{
              height: "80vh",
              overflow: "auto",
              backgroundColor: "#ffffff",
              color: "#000000",
              padding: "20px"
            }}
          >
<Tags references={tile.references}/>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {tile.jumpto && (
              <a
                style={{ height: 24 }}
                className="button"
                href={tile.jumpto}
                target="_blank"
              >
                Jump to
              </a>
            )}
            {tile.externalArticle && (
              <a
                style={{ height: 24 }}
                className="button"
                href={tile.externalArticle}
                target="_blank"
              >
                Details
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

AppFullSizeTile.propTypes = {
  tile: Object,
  onClick: PropTypes.func
};

export default function App() {
  const [titlegraphics, setTitlegraphics] = useState("");
  const [tiles, setTiles] = useState([]);
  const [isZoomed, setIsZoomed] = useState(true);
  const [currentTile, setCurrentTile] = useState(null);
  useEffect(() => {
    var search = getSearchParametersFromHRef(window.location.href);

    var href = search.src
      ? search.src
      : "https://api.jumpto365.com/table/nets.eu/test";
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
