import React from "react";
import logo from ".//nets/logo_intranets.png";
export default {
  clientId: "c69e0e4e-eb7b-4ea3-a9a9-d0837dced021",
  scopes: ["user.readwrite", "Sites.Read.All"],
  title: "Publisher",
  logo,
  model: {
    toolLists: [
      {
        graphUrl:
          "https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/intranets-tools:/lists/Links/items?expand=fields",
        webUrl:
          "https://christianiabpos.sharepoint.com/sites/intranets-tools/Lists/Links"
      }
    ]
  },
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
