import React, { Component } from "react";

import "./App.css";
import "./css/normalize.css";
import "./css/webflow.css";
import "./css/nets-technology-process-map.webflow.css";
import { getSearchParametersFromHRef } from "./helpers";
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
        json = sample;
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
                header: { text: cell.groupSetting.title ,
                  color: cell.groupSetting ? cell.groupSetting.color : "",},
                rows: []
              };

              for (let index = 2; index < grid.length; index++) {
                if (hasLabel[index]) {
                  const contentCell = grid[index][id];
                  phase.rows.push({
                    text: contentCell.tile ? contentCell.tile.inShort : "",
                    color: contentCell.tile ? contentCell.tile.color : "",
                  });
                }
              }
              matrix.phases.push(phase);
              
            }
            debugger
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
      <div className="w-container">
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
                  <div className="rowlabelcontainer" key={id} >
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
                  <div className="netsprocessphaseheader" >
                    <div className="phase1" >
                      <div className="div-block-13 w-clearfix" style={{backgroundColor:phase.color}}>
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
                    return (
                      <div className="netsprocesscell" key={id}>
                        {/* eslint-disable-next-line */}
                        <a href="#" className="celllink w-inline-block">
                          <div className="middlecentertext">{row.text}</div>
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
