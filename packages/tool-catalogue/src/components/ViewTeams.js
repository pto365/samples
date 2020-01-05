import React from "react";
import PropTypes from "prop-types";
export const ViewTeams = props => {
  if (props && props.memberShips) {
    return (<div className="tags" >
      {props.memberShips.map((team,key) => {
        
        var href = team.data && team.data.details ? team.data.details.webUrl : ""

        if (href){
          
          var part1 = href.split("https://teams.microsoft.com/l/team/")
          var part2 = part1[1].split("/conversations?")
          var part3 = href.split("groupId=")
          var part4 = part3[1].split("&")
          var part5 = href.split("tenantId=")
          



          var threadId = part2[0]
          var groupId = part4[0]
          var tenantId = part5[1]
          
          href = `https://teams.microsoft.com/_?tenantId=${tenantId}#/conversations/unknown?groupId=${groupId}&threadId=${threadId}&ctx=channel`
          

        }
        return <div key={key} style={{ padding: "4px", margin: "4px", }}>
          <a href={href}  rel="noopener noreferrer"  target="_blank">

          {team.title}
          </a>
        </div>;
      })}
    </div>);
  }
  else {
    return null;
  }
};
ViewTeams.propTypes = {
  memberShips: PropTypes.array
};
