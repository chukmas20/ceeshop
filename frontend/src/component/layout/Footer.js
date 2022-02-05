import React from 'react';
import "./Footer.css";
import apples from "../../images/apples.jpeg";
// import appStore from "../../images/apple.jpg";




const Footer = () => {
    return (
          <footer id="footer">
            <div className="leftFooter">
                <h4>Choose to eat well</h4>
                <p>Call 08099442608</p>
                <img src={apples} alt="playstore" width="100px"  height="100px" style={{borderRadius:"50%"}}/>
            </div>

            <div className="midFooter">
                <h1>CEESHOP.</h1>
                <p>High Quality is our first priority</p>

                <p>Copyrights 2022 &copy; CEESHOP</p>
            </div>

            <div className="rightFooter">
                <h4>Our Social Media</h4>
                <a href="http://instagram.com/">Instagram</a>
                <a href="http://youtube.com/">Youtube</a>
                <a href="http://instagram.com/">Facebook</a>
            </div>
    </footer>
    )
}

export default Footer
