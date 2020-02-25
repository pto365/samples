import React from "react";
import logo from ".//nets/logo_intranets.png";
export default {
  clientId: "3befe8c6-843e-4f4f-8b5b-b8e37174b961",
  scopes: ["user.readwrite", "Sites.Read.All"],
  title: "Publisher",
  logo,

  components: {
    header: (
      <div style={{ borderBottom: "1px solid #cccccc" }}>
        <div style={{ display: "flex", margin: "20px" }}>
          <div>
            <img style={{ height: "20px", padding: "4px" }} src={logo} />
          </div>
          <div
            style={{
              marginLeft: "16px",
              fontSize: "20px",
              lineHeight: "20px",
              padding: "4px"
            }}
          >
            Publisher
          </div>
        </div>
      </div>
    )
  }
};
