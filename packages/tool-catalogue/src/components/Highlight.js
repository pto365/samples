import React from "react";
import PropTypes from "prop-types";
export const Highlight = props => {
  
if (!props.text) return null
if (!props.filter) return  props.text

    var ix = props.text.toLowerCase().indexOf(props.filter.toLowerCase())
   if (ix===-1){
     return props.text
   }

   
   var first = props.text.substr(0,ix)
   var middle = props.text.substr(ix,props.filter.length)
   var last = props.text.substr(ix+props.filter.length)
  return (
    <>
   
      <span>{first}</span>
      <span style={props.style}>{middle}</span>
       <span>{last}</span>
    
    </>
  );
};
Highlight.propTypes = {
  style: PropTypes.object,

  filter: PropTypes.string,
  text: PropTypes.string
};
