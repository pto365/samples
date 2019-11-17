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
export default class componentName extends Component {
  hasChanged = e => {
    if (!this.state) return;
    if (!this.state.tree) return;
    this.setCurrent(this.state.tree);
  };
  setCurrent = tree => {
    var hash = getSearchParametersFromHash(window.location.href);
    var that = this;
    function findCurrentLeaf(leaf, parents) {
      if (hash.key && hash.key === leaf.key) {
        that.current = { leaf, parents };
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
      this.current = { leaf: tree, parents: [] };
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
         
          var leaf = {
            title: prop ? prop.title : srcNode.title,
            key: srcNode.key,
            link: prop ? prop.link : srcNode.link,
            icon: prop ? prop.icon : srcNode.icon,
            parents,
            childs: []
          };
          if (srcNode.children) {
            srcNode.children.forEach(child => {
              var ancestors = _.clone(parents);
              ancestors.push(leaf)
              leaf.childs.push(extract(child, ancestors));
            });
          }
          return leaf;
        }

        var tree = extract(srcTree[0], []);

        this.setState({ json, tree });
        this.setCurrent(tree);
      });

    this.setState({});
    //    var toolbar = search.data; // "https://api.jumpto365.com/table/nets.eu/group-tech-highlevel";
  }
  render() {
    
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
    var search = getSearchParametersFromHRef(window.location.href);

    return (
      <div className="section-30">
        <div className="w-container">
          <div className="div-block-31">
            <div className="div-block-32">
              <div className="domainbartitlle">{current.title}</div>
            </div>
            <div className="div-block-33">
              <div className="div-block-28">
                <div className="w-dyn-list">
                  <div className="w-dyn-items">
                    <div className="collection-item-4 w-dyn-item">
                      <img height="24" src="" alt="" className="image"></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="div-block-34">
            {/* <div><a href="https://header-division-department-team.webflow.io/unit/group-technology" className="link">Group Technology &gt; </a></div>
          <div><a href="https://header-division-department-team.webflow.io/divisions/group-it" className="link">Group IT &gt; </a></div> */}
            {parents.map((parent, key) => {
              var link = parent.link ? parent.link : "#key=" + parent.key;
              return (
                <div key={key}>
                  <a href={link} className="link-block-7 w-inline-block">
                    <div className="html-embed-8 w-embed">
                   
                      {parent.title}
                      <span className="pipe">></span>
                    </div>
                  </a>
                </div>
              );
            })}
            {current &&
              current.childs &&
              current.childs.map((child, key) => {
                var link = child.link ? child.link : "#key=" + child.key;
                return (
                  <div key={key}>
                    <a href={link} className="link-block-7 w-inline-block">
                      <div className="html-embed-8 w-embed">
                        {key === 0 ? "" : <span className="pipe">|</span>}
                        {child.title}
                      </div>
                    </a>
                  </div>
                );
              })}

            <div>
              <div className="html-embed-7 w-embed"> ></div>
            </div>
          </div>
        </div>
        {/* {JSON.stringify(parents)} */}
      </div>
    );
  }
}
