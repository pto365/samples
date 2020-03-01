import React from "react";
import logo from "./nttdata/logo.svg";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";
const defaultTableKey =  "jumpto365.com/APAC%20DIGITAL%20WORKPLACE"
const defaultTable = "https://pro.jumpto365.com/@/" + defaultTableKey
const defaultTableAPI = "https://api.jumpto365.com/table/"+defaultTableKey
export default {
  clientId: "",
  scopes: ["user.read"],
  title: "Tools",
  logo,
  defaultTable,
  defaultTableAPI ,
  defaultTableKey,
  options: [
    {
      key: "fruitsHeader",
      text: "NTTDATA",
      itemType: DropdownMenuItemType.Header
    },
    {
      key: {
        id: "nets.eu/2019-q4",
        api:
          "https://api.jumpto365.com/table/nets.eu/2019-q4",
        web: "https://pro.jumpto365.com/@/nets.eu/2019-q4"
      },
      text: "One Tenant - Wave 1"
    },
    {
      key: {
        id: "nets.eu/digital-workplace",
        api:
          "https://api.jumpto365.com/table/nets.eu/digital-workplace",
        web:
          "https://pro.jumpto365.com/@/nets.eu/digital-workplace"
      },
      text: "Digital Workplace"
    },
    {
      key: {
        id: "nets.eu/group-tech-highlevel",
        api:
          "https://api.jumpto365.com/table/nets.eu/group-tech-highlevel",
        web:
          "https://pro.jumpto365.com/@/nets.eu/group-tech-highlevel"
      },
      text: "Group Tech Playbook"
    },

    {
      key: "divider_1",
      text: "-",
      itemType: DropdownMenuItemType.Divider
    },
    {
      key: "jumpto365",
      text: "Generic Periodic Tables",
      itemType: DropdownMenuItemType.Header
    },
    {
      key: {
        id: defaultTableKey,
        api:
        defaultTableAPI,
        web:
          defaultTable
      },
      text: "Office 365"
    },
    {
      key: {
        id: "jumpto365.com/ems5",
        api:
          "https://api.jumpto365.com/table/jumpto365.com/ems5",
        web:
          "https://pro.jumpto365.com/@/jumpto365.com/ems5"
      },
      text: "EMS"
    }
    //{ key: 'https://raw.githubusercontent.com/hexatown/docs/master/contexts/ai/index.json', text: 'AI' }
  ],
  components: {
    header: (
      <div style={{ borderBottom: "1px solid #cccccc",paddingTop:"8px" }}>
        <div style={{ display: "flex", margin: "20px" }}>
          <div>
            <img style={{ height: "40px", padding: "4px" }} src={logo} />
          </div>
          <div
            style={{
              marginLeft: "16px",
              fontSize: "20px",
              lineHeight: "20px",
              padding: "4px"
            }}
          >
            APAC Digital Workplace
          </div>
        </div>
      </div>
    )
  }
};
