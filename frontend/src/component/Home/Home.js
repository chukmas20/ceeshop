import React from 'react';
import { CgMouse} from "react-icons/all"
import MetaData from '../layout/MetaData';
import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import "./Home.css";
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import { useAlert } from "react-alert";
import ProductCard from '../product/ProductCard';



const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const {error, loading, products, productsCount} = useSelector (state => state.products)


   useEffect(()=>{
    if(error){
        alert.error(error)
        dispatch(clearErrors())
     }
     dispatch(getProducts())
 }, [dispatch, error, alert])
    return (
        <>
         <MetaData title="CeeShop" />
            <div className="banner">
                <p> Welcome to ceeshop </p> 
                <h1> Pick from our Array of products</h1> 
                <h3> Call 08099442608 to place an order</h3> 

                <a href="#container">
                    <button> Scroll <CgMouse />  </button>
                </a>
            </div>
            <h2 className='homeHeading'> Featured Products</h2>
            <div className='container' id='container'>
                {loading ? (<Loader />):(
                     <>
                     {products && products.map(product =>(
                         
                              <ProductCard  product={product} key={product._id}  />
     
                     ))}
                     </>
                )} 
            </div>
        </>
    )
}

export default Home
