import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import CircularIndeterminate from './components/UI/FeedBack';
import LoadingUI from './components/UI/Loading';
import { fetchProductData } from './slices/product-slice';
import { fetchCodeData } from './slices/promotion-slice';
import 'react-toastify/dist/ReactToastify.css';

export const uiLoading = (active) => {
  ReactDOM.render(<LoadingUI active={active}/>, document.getElementById('ui-control'));
}

function App() {

  const uiController = useSelector(state => state.uiController);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductData());
    dispatch(fetchCodeData());
  }, []);

  const Admin = React.lazy(() => import('./pages/admin'));
  const CreateProduct = React.lazy(() => import('./pages/admin/create-product'));
  const ManageCatBra = React.lazy(() => import('./pages/admin/manage-categories-brands'));
  const RegisterJWT = React.lazy(() => import('./pages/register-jwt-auth'));
  const ActivationJWT = React.lazy(() => import('./pages/activation-jwt-auth'));
  const LoginJWT = React.lazy(() => import('./pages/login-jwt-auth'));
  const ResetRequestJWT = React.lazy(() => import('./pages/reset-request-jwt-auth'));
  const ResetPasswordJWT = React.lazy(() => import('./pages/reset-password-jwt-auth'));
  const HomePage = React.lazy(() => import('./pages/customer/HomePage'));
  const Search = React.lazy(() => import('./pages/customer/Search'));
  const Cart = React.lazy(() => import('./pages/customer/Cart'));
  const Checkout = React.lazy(() => import('./pages/customer/Cart/Checkout'));
  const CheckoutPaypal = React.lazy(() => import('./pages/customer/Cart/Checkout/CheckoutPaypal'));
  const Detail = React.lazy(() => import('./pages/customer/DetailsPage'));
  const Profile = React.lazy(() => import('./pages/customer/Profile'));
  const Category = React.lazy(()=> import('./pages/customer/Category'));
  return (
    <Suspense fallback={<CircularIndeterminate/>}>
        <div id="ui-control"></div>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover/>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/search" component={Search}/>     
            <Route exact path="/admin" component={Admin}/>        
            <Route exact path="/admin/create-product" component={CreateProduct}/>
            <Route exact path="/admin/create-product/:id" component={CreateProduct}/>
            <Route exact path="/admin/manage-cat-bra" component={ManageCatBra}/>
            <Route exact path="/registerJWT" render={props => <RegisterJWT {...props}/>}/>
            <Route exact path="/activationJWT/:token" render={props => <ActivationJWT {...props}/>}/>
            <Route exact path="/login" render={props => <LoginJWT {...props}/>}/>
            <Route exact path="/reset" render={props => <ResetRequestJWT {...props}/>}/>
            <Route exact path="/reset/:token" render={props => <ResetPasswordJWT {...props}/>}/>
            <Route exact path="/cart" component={Cart}/>
            <Route exact path="/checkout/:promotionCode" component={Checkout}/>
            <Route exact path="/checkout/paypal/:promotionCode" component={CheckoutPaypal}/>
            <Route exact path="/detail/:productID" component={Detail}/>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/category/:categoryName" component={Category}/>
          </Switch>
        </Router>          
    </Suspense>
  );
}
export default App;
