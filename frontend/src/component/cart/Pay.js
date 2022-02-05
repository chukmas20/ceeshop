import "./Payment.css";
import React, { useEffect, useRef } from "react";
import CheckoutSteps from './CheckoutSteps';
import { useSelector, useDispatch } from "react-redux";

import { Typography } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import { clearErrors, createOrder } from "../../actions/orderAction";

const Pay = ({history}) => {

    const submitHandler =()=>{

      dispatch(createOrder(order));

      
        history.push("/success")
    }

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const {user} =  useSelector((state)=> state.user)
    const {error} =  useSelector((state)=> state.newOrder)

    const dispatch = useDispatch();

    const order ={
      shippingInfo,
      orderItems: cartItems,
      itemsPrice: orderInfo.subtotal,
      taxPrice: orderInfo.tax,
      shippingPrice: orderInfo.shippingCharges,
      totalPrice: orderInfo.totalPrice,
   }
  
    

    useEffect(()=>{
       if(error){
         alert.error(error)
         dispatch(clearErrors())
       }
    }, [dispatch, error, alert])

  return (
     <>
        <MetaData  title="Payment" />
         <CheckoutSteps activeStep={2} />
         <div className="paymentContainer">
            <Typography>Card Info</Typography>
            <div>
                <h3> Transfer Amount to 2054137536(UBA) or pay on delivery</h3>
            </div>
            <div className="paymentForm">
            <input 
                 type="submit"   
                 value="Proceed to PlaceOrder"              
                 className="paymentFormBtn"
                 onClick={submitHandler}
                 style={{color:"white",fontSize:"65",fontWeight:"bold"}}
              /> 
            </div>           
         </div>
     </>
   ) 
};

export default Pay;
