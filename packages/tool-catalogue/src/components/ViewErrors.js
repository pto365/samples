import React from "react";
import PropTypes from "prop-types";
export const ViewErrors = props => {
  if (props && props.errors) {
    return (<div className="tags" >
      {props.errors.map((error,key) => {
        return <div key={key} style={{ padding: "4px", margin: "4px", }}>
          When trying {error.context}, you got 
          {JSON.stringify(error)}
        </div>;
      })}
    </div>);
  }
  else {
    return null;
  }
};
ViewErrors.propTypes = {
  errors: PropTypes.array
};
