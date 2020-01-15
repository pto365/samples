import React from "react";
import PropTypes from "prop-types";
export const Tags = props => {
  if (props && props.references) {
    return (<div className="tags" style={{ display: "flex",flexWrap:"wrap" }}>
      {props.references.map((group,key) => {
        return <div key={key} style={{ padding: "4px", margin: "4px", backgroundColor: group.color, color: group.textColor }}>
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
