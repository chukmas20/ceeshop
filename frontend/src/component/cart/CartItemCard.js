import React from 'react';
import "./CartItemCard.css";
import {Link} from "react-router-dom"
import DeleteIcon from "@material-ui/icons/Delete";


const CartItemCard = ({item, deleteCartItems}) => {
    return (
        <div className='CartItemCard'>
             <img src={item.image} alt="ssa"  />
             <div>
                 <Link to={`/product/${item.product}`}> {item.name}</Link>
                 <span>{`Price:${item.price}`}</span>
                 <p onClick={()=> deleteCartItems(item.product)}>
                      <DeleteIcon />
                 </p>
             </div>
        </div>
    )
}

export default CartItemCard
