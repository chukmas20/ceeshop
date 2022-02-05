import React, {useState} from 'react'
// import { useNavigate } from 'react-router';
import MetaData from '../layout/MetaData';
import "./Search.css";

const Search = ({ history}) => {
    const [keyword, setKeyword] = useState(" ")
    // const navigate = useNavigate();


    const searchSubmitHandler = (e) =>{
        e.preventDefault();
        if(keyword.trim()){
            history.push(`/products/${keyword}`)
        }else{
            history.push('/products')
        }
    }
    return (
         <>
          <MetaData  title=" Search A product" />
           <form className='searchBox' onSubmit={searchSubmitHandler}>
               <input 
                  type="text"
                  placeholder='search for a product'
                  onChange={(e) => setKeyword(e.target.value)} 
               />
               <input type="submit" value="Search" />
           </form>
         </>
    )
}

export default Search
