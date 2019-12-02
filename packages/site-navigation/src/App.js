import React, { Component } from "react";

import "./App.css";
import "./css/normalize.css";
import "./css/webflow.css";
import "./css/header-division-department-team.webflow.css";
import {
  getSearchParametersFromHRef,
  getSearchParametersFromHash
} from "./helpers";
import sample from "./sample.json";
import _ from "lodash";
import "office-ui-fabric-core/dist/css/fabric.min.css";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { loadTheme } from 'office-ui-fabric-react';
initializeIcons(/* optional base url */);



export default class componentName extends Component {
  hasChanged = e => {
    if (!this.state) return;
    if (!this.state.tree) return;
    this.setCurrent(this.state.tree);
  };
  setCurrent = tree => {
    var hash = getSearchParametersFromHash(window.location.href);
    var search = getSearchParametersFromHRef(window.location.href);
    var that = this;
    function findCurrentLeaf(leaf, parents) {
      if (
        (hash.key && hash.key === leaf.key) ||
        (search.href && search.href === leaf.href)
      ) {
        var p = [];

        parents.forEach(parent => {
          p.push(parent);
        });
        //p.push(leaf)

        that.current = { leaf, parents: p };
        return;
      }

      parents.push(leaf);
      if (leaf.childs) {
        leaf.childs.forEach(child => {
          findCurrentLeaf(child, parents);
        });
      }
    }

    findCurrentLeaf(tree, []);

    if (!this.current) {
      this.current = { leaf: tree, parents: [tree] };
    }
    if (
      this.state.current &&
      this.state.current.leaf.key === this.current.leaf.key
    )
      return;
    this.setState({ current: this.current });
  };

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.hasChanged, false);
  }
  componentDidMount() {
    window.addEventListener("hashchange", this.hasChanged, false);
    var search = getSearchParametersFromHRef(window.location.href);

    var dataHref = search.data
      ? search.data
      : "https://jumpto36500001.blob.core.windows.net/toolbars/n/e/t/nets.eu/Intranets-Group-Technology.json";
    fetch(dataHref)
      .then(response => {
        return response.json();
      })
      .then(json => {
        var srcTree = json.tree ? json.tree : [];
        var props = json.properties;

        function extract(srcNode, parents) {
          var prop = props[srcNode.key];
          if (prop) console.log(prop.href);
          var leaf = {
            title: prop ? prop.title : srcNode.title,
            key: srcNode.key,
            link: srcNode.link,
            icon: prop ? prop.icon : srcNode.icon,
            href: prop ? prop.href : null,
            parents,
            childs: []
          };
          if (srcNode.children) {
            srcNode.children.forEach(child => {
              var ancestors = _.clone(parents);
              ancestors.push(leaf);
              leaf.childs.push(extract(child, ancestors));
            });
          }
          return leaf;
        }

        var tree = extract(srcTree[0], []);

        this.setState({ json, tree });
        debugger
        this.setCurrent(tree);
      });

    this.setState({});
    //    var toolbar = search.data; // "https://api.jumpto365.com/table/nets.eu/group-tech-highlevel";
  }
  render() {
    var hash = getSearchParametersFromHash(window.location.href);
    var current =
      this.state && this.state.current && this.state.current.leaf
        ? this.state.current.leaf
        : { childs: [], parents: [] };

    var parents =
      this.state &&
      this.state.current &&
      this.state.current.leaf &&
      this.state.current.leaf.parents
        ? this.state.current.leaf.parents
        : [];

    return (
      <div className="section-30 ms-Fabric ms-fontSize-18 "  >
        <div> 
        <div className="expandTree"  style={{position:"fixed",top:"4px",right:"4px",backgroundColor:"#ffffff"}}><a href="#expand=1" target="_top"><i className="ms-Icon ms-Icon--MiniExpand" aria-hidden="true"></i></a>
        </div>
    
          <div
            className="div-block-34"
            style={{
              paddingLeft: "10px",
              lineHeight: "32px",
              overflowX: "scroll"
            }}
          >
            {parents.map((parent, key) => {
              var link = parent.link ? parent.link : "#key=" + parent.key;
              return (
                <div key={key}>
                  <a href={link} className="link-block-7 w-inline-block">
                    <div className="html-embed-8 w-embed " >
                      {parent.title}
                      <span className="pipe">></span>
                    </div>
                  </a>
                </div>
              );
            })}

            {current && (
              <div>
                <div
                  className="html-embed-8 w-embed"
                  style={{ fontWeight: "bold" }}
                >
                  {current.title}
                  <span className="pipe">></span>
                </div>
              </div>
            )}
            {current &&
              current.childs &&
              current.childs.map((child, key) => {
                var link = child.link ? child.link : "#key=" + child.key;
                return (
                  <div key={key}>
                    <a
                      href={link}
                      target="_self"
                      className="link-block-7 w-inline-block"
                    >
                      <div className="html-embed-8 w-embed ">
                        {key === 0 ? "" : <span className="pipe">|</span>}
                        {child.title}
                      </div>
                    </a>
                  </div>
                );
              })}
            {current && hash.key && current.href && (
              <div>
                <a
                  href={current.href}
                  target="_top"
                  className="link-block-7 w-inline-block"
                  title={"Jump to " + current.title}
                >
                  <div
                    className="html-embed-8 w-embed"
                    style={{
                      color: "white",
                      backgroundColor: "#aaaaaa",
                      marginLeft: "8px",
                      borderRadius: "6px",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Jump to
                  </div>
                </a>
              </div>
            )}
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}
