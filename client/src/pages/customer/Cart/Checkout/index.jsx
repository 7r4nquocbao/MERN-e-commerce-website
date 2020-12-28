import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FastField, Formik } from 'formik';
import { Form } from 'reactstrap';
import Header from '../../../../components/UI/Header';
import CheckOutForm from './CheckoutForm';
import Title from '../../../../components/UI/Title'
import TopMenu from '../../../../components/UI/TopMenu'
import { createOrder } from '../../../../api';
import { isAuth } from '../../../../helpers/auth';
import { useHistory, useParams } from 'react-router-dom';

Checkout.propTypes = {

};

function Checkout(props) {

  const history = useHistory();
  const {promotionCode} = useParams();

  useEffect(() => {
    document.title = 'Check Out';
  }, [])

  const handleCheckout = (values) => {

    const order = values;
    const orderDetails = JSON.parse(localStorage.getItem('cart'));

    let idu = isAuth()._id;

    if(!idu) {
      idu = '';
    }

    const orderUpdated = {...order, idUser: idu, promotionCode: promotionCode};

    const data = {
      order: orderUpdated,
      orderDetails: orderDetails
    }
    
    createOrder(data).then(res => {
      console.log(res.data);

      localStorage.setItem('cart', '[]');
      history.push('/cart');

    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="checkout">
      <Header />
      <TopMenu />
      <Title title="Checkout Information" />
      <CheckOutForm onSubmit={handleCheckout} />
    </div>
  )
}

export default Checkout;