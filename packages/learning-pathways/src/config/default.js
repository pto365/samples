import React from 'react'
import PropTypes from 'prop-types'
import logo from "./default/Logo.png";
import hero from "./default/Hero Photo 1.jpg"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';



function MakeThisYours() {
  return (
    <div style={{textAlign:"center",margin:20}}>
    <PrimaryButton text="Make this yours" target="_blank" href="https://www.jumpto365.com"/>
    </div>
  );
}




export default {
  clientId: "443ae28d-8cf8-42fd-ba63-f403ac085ead",
  scopes: ["user.readwrite", "Sites.Read.All"],
  title: "Microsoft 365 Learning Videos",
  logo,
  currentAlerts:
    "https://graph.microsoft.com/v1.0/sites/christianiabpos.sharepoint.com:/sites/intranets-corp:/lists/currentAlerts/items?expand=fields",
  welcome: (
    <div style={{position:"relative"}}>
      <img style={{maxHeight:"100vh",maxWidth:"100vw"}} src={hero} ></img>
      <div style={{textAlign:"center",position:"absolute",backgroundColor:"#ffffff99",top:"30vh",padding:20,width:"100%"}}>
      <div className="ms-font-xl">Greeting fellow Microsoft 365'ians </div>

      <p  className="ms-font-m">
        Here you find a catalogue of 616 videos produced by Microsoft proudly
        served by  by{" "}
        <a href="https://www.jumpto365.com/" target="_blank">
         jumpto365, Inc{" "}
        </a>
        
        <MakeThisYours />
      </p>
    </div>
    </div>
  )
};
