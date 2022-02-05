import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from './component/layout/Header';
import webfont from "webfontloader";
import Footer from './component/layout/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/product/ProductDetails';
import Products from './component/product/Products';
import Search from './component/product/Search';
import LoginSignUp from './component/user/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import UserOptions from './component/layout/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './component/user/Profile';
// import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/user/UpdateProfile';
import UpdatePassword from './component/user/UpdatePassword';
import ForgotPassword from './component/user/ForgotPassword';
import ResetPassword from './component/user/ResetPassword';
import Cart from './component/cart/Cart';
import Shipping from './component/cart/Shipping';
import ConfirmOrder from './component/cart/ConfirmOrder';
import axios from "axios";
import Payment from './component/cart/Payment';
import Pay from './component/cart/Pay';
import OrderSuccess from './component/cart/OrderSuccess';
import MyOrder from './component/orders/MyOrder';
import OrderDetails from './component/orders/OrderDetails';
import Dashboard from './component/admin/Dashboard';
import ProductList from './component/admin/ProductList';
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct';
import OrderList from './component/admin/OrderList';
import ProcessOrder from './component/admin/ProcessOrder';
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser';
import ProductReviews from './component/admin/ProductReviews';
import Contact from './component/layout/contact/Contact';



function App() {
  const {isAuthenticated, user} = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
    store.dispatch(loadUser())

    getStripeApiKey();

  }, [])

  

  return (
      <Router>
           <Header />
           {isAuthenticated && <UserOptions  user={user}  />}

               <Route  path="/" component={Home} exact/>
               <Route  path="/product/:id" component={ProductDetails } />
               <Route   path="/products" component={Products} exact/>
               <Route  path="/products/:keyword" component={Products} exact/>
               <Route  path="/search" component={Search } />
               <Route   path="/login"   component={LoginSignUp }  exact/>
               {/* <Route  element={<ProtectedRoute  />} /> */}
               <Route    path="/account"   component={Profile}  exact/>
               <Route   path="/me/update"   component={UpdateProfile } exact />
               <Route   path="/password/update"  component={UpdatePassword } exact />
               <Route   path="/password/forgot"  component={ForgotPassword }  exact/>
               <Route   path="/password/reset/:token"  component={ResetPassword}  exact/>
               <Route   path="/cart"  component={Cart }  exact/>
               <Route    path="/shipping"  component={Shipping }  exact/>
               <Route    path="/order/confirm"  component={ConfirmOrder}  exact/>
                {stripeApiKey && (
                     <Elements stripe={loadStripe(stripeApiKey)}>
                     <Route exact path="/process/payment" component={Payment} />
                 </Elements>
                )}  
                <Route  path="/pay"  component={Pay}  exact/>
                <Route  path="/success"  component={OrderSuccess}  exact/>
                <Route  path="/orders"  component={MyOrder}  exact/>
                <Route  path="/order/:id"  component={OrderDetails}  exact/>
                <Route   path="/admin/dashboard" component={Dashboard}  exact />
                <Route   path="/admin/products" component={ProductList}  exact />
                <Route   path="/admin/product" component={NewProduct}  exact />
                <Route   path="/admin/product/:id" component={UpdateProduct}  exact />
                <Route   path="/admin/orders/" component={OrderList}  exact />
                <Route   path="/admin/order/:id" component={ProcessOrder}  exact />
                <Route   path="/admin/users" component={UsersList}  exact />
                <Route   path="/admin/user/:id" component={UpdateUser}  exact />
                <Route   path="/admin/reviews" component={ProductReviews}  exact />
                <Route   path="/contact" component={Contact}  exact />

           <Footer />
      </Router>
  );
}

export default App;
