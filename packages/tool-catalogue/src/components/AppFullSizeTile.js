import React, { useState, useEffect } from "react";
import axios from "axios";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import PropTypes from "prop-types";
import { Tags } from "./Tags";
export const AppFullSizeTile = props => {
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
  return (<>
    {error && <div>{error}</div>}
    <div onClick={props.onClose} style={{
      backgroundColor: tile.color,
      color: tile.textcolor,
      width: "100vw",
      height: "100vh",
      overflow: "auto"
    }}>
      <div>
        <div style={{ display: "flex" }}>
          <div>
            {" "}
            <img style={{ margin: "1vh", height: "10vh", width: "auto" }} src={tile.icon} />
          </div>
          <div style={{ height: "10vh", width: "auto" }}>
            <div className="fullSizeHeading" style={{
              padding: "3vh",
              fontSize: "5vh",
              textOverflow: "nowrap",
              whiteSpace: "no-wrap"
            }}>
              {tile.title}
            </div>
            <div className="fullSizeDescription" style={{ paddingLeft: "3vh", fontSize: "3vh" }}>
              {tile.inShort}
            </div>
          </div>
        </div>

        <div style={{
          height: "80vh",
          overflow: "auto",
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "20px"
        }}>
          <Tags references={tile.references} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {tile.jumpto && (<a style={{ height: 24 }} className="button" href={tile.jumpto} target="_blank">
          Jump to
            </a>)}
        {tile.externalArticle && (<a style={{ height: 24 }} className="button" href={tile.externalArticle} target="_blank">
          Details
            </a>)}
      </div>
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {tile.jumpto && (<a style={{ height: 24 }} className="button" href={tile.jumpto} target="_blank">
            Jump to
              </a>)}
          {tile.externalArticle && (<a style={{ height: 24 }} className="button" href={tile.externalArticle} target="_blank">
            Details
              </a>)}
        </div>
      </div>
    </div>
  </>);
};
AppFullSizeTile.propTypes = {
  tile: Object,
  onClick: PropTypes.func
};
