import React from "react";
import PropTypes from "prop-types";
export const Tags = props => {
  if (props && props.references) {
    return (<div className="tags" style={{ display: "flex" }}>
      {props.references.map(group => {
        return <div style={{ padding: "4px", margin: "4px", backgroundColor: group.color, color: group.textColor }}>
          {group.title}
        </div>;
      })}
    </div>);
  }
  else {
    return null;
  }
};
Tags.propTypes = {
  references: PropTypes.array
};
