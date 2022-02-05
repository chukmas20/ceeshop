import React, {useState} from 'react';
import "./Header.css";
import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import {useDispatch, useSelector} from "react-redux";
import DashboardIcon from "@material-ui/icons/Dashboard"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import Backdrop from "@material-ui/core/Backdrop";
// import { useNavigate } from 'react-router';
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert';
import { logout } from '../../actions/userAction';



const UserOptions = ({user}) => {
    const {cartItems} = useSelector((state)=> state.cart)

    const [open, setOpen] = useState(false)
    const alert = useAlert()
    const dispatch = useDispatch()
    const history = useHistory()
    // const navigate = useNavigate()
    
    const options =[
        {icon: <ListAltIcon />, name:"Orders", func:orders},
        {icon: <PersonIcon />, name:"Profile", func: account},
        {icon: <ShoppingCartIcon style={{color:cartItems.length > 0 ? "tomato" : "gray"}}
          />, name:`Cart(${cartItems.length})`, func: cart
        },
        {icon: <ExitToAppIcon />, name:"Logout", func: logoutUser}
    ]


    if(user.role === "admin"){
        options.unshift({
            icon: <DashboardIcon />,
            name:"Dashboard",
            func: dashboard
        })
    }

    function dashboard(){
         history.push("/admin/dashboard");
    }

    function orders(){
        history.push("/orders")
    }

    function account(){
        history.push("/account")
    }
    function cart(){
        history.push("/cart")
    }

    function logoutUser(){
        dispatch(logout())
        alert.success("Logged out successfully");
    }

    return (
        <>
         {/* <Backdrop open={true} style={{zIndex:"10"}}/> */}
          <SpeedDial ariaLabel='SpeedDial tooltip example'
            onClose={()=> setOpen(false)}
            onOpen={()=> setOpen(true)}
            open={open}
            style={{zIndex:"11"}}
            direction='down'
            className="speedDial"
            icon={
                <img  
                  src={user.avatar.url ? user.avatar.url : "/profile.png" }
                   alt="Profile"
                   className='speedDialIcon'  
                />
            }
          >
             {options.map((item)=>(
                 <SpeedDialAction  icon={item.icon} tooltipTitle={item.name}
                    key={item.name}
                   onClick={item.func}
                   tooltipOpen = {window.innerWidth <= 600 ? true : false}
                 />
             ))}
          </SpeedDial>
        </>
    )
}

export default UserOptions
