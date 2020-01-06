import React from "react";
import PropTypes from "prop-types";
export const ViewTeams = props => {
  if (props && props.memberShips) {
    return (
      <div className="tags" style={{
        padding: "4px",
        margin: "4px",
        fontSize: "16px",
        display: "flex",
        flexWrap:"wrap"

      }}>
        {props.memberShips.map((team, key) => {
          var href =
            team.data && team.data.details ? team.data.details.webUrl : "";

          if (href) {
            var part1 = href.split("https://teams.microsoft.com/l/team/");
            var part2 = part1[1].split("/conversations?");
            var part3 = href.split("groupId=");
            var part4 = part3[1].split("&");
            var part5 = href.split("tenantId=");

            var threadId = part2[0];
            var groupId = part4[0];
            var tenantId = part5[1];

            var conversationsHref = `https://teams.microsoft.com/_?tenantId=${tenantId}#/conversations/unknown?groupId=${groupId}&threadId=${threadId}&ctx=channel`;
            var filesHref = `https://teams.microsoft.com/_?tenantId=${tenantId}#/files/unknown?groupId=${groupId}&threadId=${threadId}&ctx=channel`;
          }
          var details =
            team.data && team.data.details
              ? team.data.details
              : { displayName: team.title };


          var photo = team.data ? team.data.photo : null    

          var channels = team.data && team.data.channels? team.data.channels : []
          return (
            <div
              key={key}
              style={{
                padding: "10px",
                margin: "10px",
                fontSize: "16px",
                display: "flex",
                border:"1px solid #dddddd",
                minWidth:"300px"
               
              }}
            >
           
              <div>{photo &&
                  <img src={photo} style={{height:"64px",margin:"10px"}}></img>
                }</div>
             
              <div>
                <div className="ms-font-xxl" style={{padding:"8px"}}>
                  
                  {details.displayName}</div>
                <div>
                <a
                style={{padding:"8px"}}
                  href={conversationsHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Posts
                </a>
                <a
                style={{padding:"8px"}}
                href={filesHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Files
                </a>
                </div>
                <div style={{
        padding: "8px",
        margin: "4px",
        fontSize: "14px",
        display: "flex",
        flexWrap:"wrap"

      }}>
        {channels.map((channel,key)=>{
          return <div key={key}>
            {channel.displayName}
          </div>
        })}


                </div>
              </div>
            
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};
ViewTeams.propTypes = {
  memberShips: PropTypes.array
};
