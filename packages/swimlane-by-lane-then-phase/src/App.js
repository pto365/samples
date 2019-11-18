import React, { Component } from "react";
import {
  getSearchParametersFromHRef
} from "./helpers";
import "./App.css";
import "./css/normalize.css";
import "./css/webflow.css";
import "./css/swimlane-process-map.webflow.css";
import sample from "./sample.json";
export default class componentName extends Component {
  componentDidMount() {
    var search = getSearchParametersFromHRef(window.location.href);
    var dataHref = search.data
      ? search.data
      : "https://api.jumpto365.com/table/nets.eu/digital-capabilities";
    fetch(dataHref)
      .then(response => {
        return response.json();
      })
      .then(json => {
       // json = sample;
        var matrix = {
          rowLabels: [],
          phases: []
        };

        var grid = json.grid ? json.grid : [];
        var hasLabel = {};
        // read labels
        if (grid.length > 0) {
          for (let index = 1; index < grid.length; index++) {
            const labelCell = grid[index][1];

            if (labelCell.groupSetting && labelCell.groupSetting.title) {
              hasLabel[index] = true;
              var label = { text: labelCell.groupSetting.title };

              matrix.rowLabels.push(label);
            }
          }
        }
        // read phases
        if (grid.length > 1) {
          grid[1].forEach((cell, id) => {
            if (cell.groupSetting) {
              var phase = {
                header: {
                  text: cell.groupSetting.title,
                  color: cell.groupSetting ? cell.groupSetting.color : "",
                  textColor: cell.groupSetting
                    ? cell.groupSetting.textColor
                    : ""
                },

                rows: []
              };

              for (let index = 2; index < grid.length; index++) {
                if (hasLabel[index]) {
                  const contentCell = grid[index][id];
                  phase.rows.push({
                  
                    text: contentCell.tile ? contentCell.tile.inShort : "",
                    color: contentCell.tile ? contentCell.tile.color : "",
                    textColor: contentCell.tile ? contentCell.tile.textcolor : "",
                    href:contentCell.tile ? contentCell.tile.jumpto : ""
                  });
                }
              }
              matrix.phases.push(phase);
            }
          });
        }

        this.setState({ json, matrix: matrix });
      });

    var matrix = {
      rowLabels: [
        { text: "Area 1" },
        { text: "Area 2" },
        { text: "Area 3" },
        { text: "Area 4" }
      ],
      phases: [
        {
          header: {
            text: "Phase 1"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        },
        {
          header: {
            text: "Phase 2"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        },
        {
          header: {
            text: "Phase 3"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        },
        {
          header: {
            text: "Phase 4"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        },
        {
          header: {
            text: "Phase 5"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        },
        {
          header: {
            text: "Phase 6"
          },
          rows: [
            { text: "row 1" },
            { text: "row 2" },
            { text: "row 3" },
            { text: "row 4" }
          ]
        }
      ]
    };
    this.setState({ matrix });
    //    var toolbar = search.data; // "https://api.jumpto365.com/table/nets.eu/group-tech-highlevel";
  }
  render() {
    return (
      <div className="w-container" style={{marginLeft:"0px"}}>
      
        <div className="netsprocessmatrix">
          <div className="netsprocessphasecolumn">
            <div className="rowlabelheadercontainer">
              <div className="processrowlabelheader"></div>
            </div>
            {this.state &&
              this.state.matrix &&
              this.state.matrix.rowLabels &&
              this.state.matrix.rowLabels.map((rowLabel, id) => {
                return (
                  <div className="rowlabelcontainer" key={id}>
                    <div className="processrowlabel">{rowLabel.text}</div>
                  </div>
                );
              })}
          </div>
          {this.state &&
            this.state.matrix &&
            this.state.matrix.phases &&
            this.state.matrix.phases.map((phase, id) => {
              return (
                <div className="netsprocessphase" key={id}>
                  <div className="netsprocessphaseheader">
                    <div
                      className="phase1"
                      style={{ backgroundColor: phase.header.color,color:phase.header.textColor }}
                    >
                      <div className="div-block-13 w-clearfix">
                        {id > 0 && (
                          <img
                            src="images/Chevron-right_Web_Fundamentals.svg"
                            alt=""
                            className="imageleft"
                          ></img>
                        )}
                        <div className="text-block-5">{phase.header.text}</div>
                        <img
                          src="images/Chevron-right_Web_Fundamentals.svg"
                          alt=""
                          className="imageright"
                        ></img>
                      </div>
                    </div>
                  </div>
                  {phase.rows.map((row, id) => {
                    if (!row.text) return  <div className="netsprocesscell" key={id} />
                    var search = getSearchParametersFromHRef(window.location.href);
                    var dataHref = search.data
                    var isCurrent = search.context === row.href
                    return (
                      <div className="netsprocesscell" key={id} >
                        {/* eslint-disable-next-line */}
                        <a href={row.href} target="_top" className="celllink w-inline-block" style={{color:isCurrent ? row.color: row.textColor,backgroundColor:isCurrent ?  row.textColor : row.color}}>
                          <div dangerouslySetInnerHTML={{__html:row.text.replace(/\n/g, "<br />")}}  className="middlecentertext"></div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
