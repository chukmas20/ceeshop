import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:coparaeke@yahoo.com">
        <Button>Contact: coparaeke@yahoo.com</Button>
      </a>
      <a className="mailBtn" >
        <Button>Contact: 08099442608</Button>
      </a>
    </div>
  );
};

export default Contact;