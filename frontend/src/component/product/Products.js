import React, {useEffect, useState} from 'react'
import "./Products.css";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { getProducts,clearErrors } from '../../actions/productAction';
import ProductCard from './ProductCard';
// import {  useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {useAlert} from "react-alert";
import MetaData from '../layout/MetaData';



const categories =[
    "Fruits",
    "vegetables",
    "Tuber",
    "cereal",
    "fruit"
]

const Products = ({match}) => {

    // const { keyword } = useParams();
    const keyword = match.params.keyword
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1)
    const {error, loading, products, productsCount, resultPerPage, filteredProductsCount} = useSelector(state => state.products)
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)

    const alert = useAlert()
    
    const setCurrentPageNo=(e)=>{
        setCurrentPage(e);
    }

    const priceHandler = (event, newPrice)=>{
        setPrice(newPrice)
    }

    let count =  filteredProductsCount
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
       dispatch(getProducts(keyword, currentPage,price, category,ratings ))
    }, [dispatch, keyword, currentPage,price, category, ratings, alert, error])

    return (
         <>
           {loading ? (<Loader />) : (
               <>
                  <MetaData title="Products..." />
                  <h2 className='productsHeading'> Products </h2>
                  <div className='products'>
                        {products && products.map(product =>(      
                            <ProductCard  product={product} key={product._id}  />
                        ))}
                  </div>
                  <div className='filterBox'>
                        <Typography> Price </Typography>
                        <Slider  
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay= "on"
                            arial-labelledby ="range-slider"
                            min = {0}
                            max={25000}
                        />
                        <Typography> Categories </Typography>
                        <ul className='categoryBox'>
                            {categories.map((category)=>(
                                <li className='category-link' key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category} 
                                </li>
                            ))}

                        </ul>
                        <fieldset>
                             <Typography component="legend"> Ratings </Typography>
                              <Slider 
                                 value ={ratings}
                                 onChange={(e, newRating)=>{setRatings(newRating)}}
                                 aria-labelledby = "continuous-slider"
                                 min={0}
                                 max={5}
                                 valueLabelDisplay='auto'
                              />
                        </fieldset>
                  </div>
                  
                    {resultPerPage < count && (
                         <div className='paginationBox'>
                         <Pagination 
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText= "Next"
                            prevPageText= "Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass='page-item'
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                         />
                    </div>
                    )}
               </>
           )}
         </>
    )
}

export default Products
