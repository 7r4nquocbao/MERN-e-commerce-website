import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import InputField from '../../../../../custom-fields/InputField';
import RadioField from '../../../../../custom-fields/RadioField';
import { Link, useParams } from 'react-router-dom';
import * as yub from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { fetchProductData } from '../../../../../slices/product-slice';
import { unwrapResult } from '@reduxjs/toolkit';
import PayPal from '../../../../../components/paypal';
import Header from '../../../../../components/UI/Header';
import TopMenu from '../../../../../components/UI/TopMenu';
import Title from '../../../../../components/UI/Title';
import { isAuth } from '../../../../../helpers/auth';

function CheckoutPaypal(props) {

    const {onSubmit} = props;
    const {promotionCode} = useParams();

    const [data, setData] = useState({
        phone: '',
        name: '',
        email: '',
        address: '',
        payment: 'paypal',
        orderCode: uuidv4(),
        idUser: '',
    });

    const [total, setTotal] = useState(1);
    const dispatch = useDispatch();
    useEffect(async () => {
        document.title = 'PayPal Check Out';
        const result = await dispatch(fetchProductData());
        const filter = filterData(unwrapResult(result));
        let count = 1;
        for (const item of filter) {
            count += item.quantity * (item.price - (item.price * item.sale / 100));
        }
        setTotal(count);
        console.log(count);
    }, [])

    const filterData = (arr) => {
        if (arr) {
            const locCart = localStorage.getItem('cart');
            if(locCart === '') {
                return [];
            } else {
                let cartItems = JSON.parse(localStorage.getItem('cart'));
                if (cartItems) {
                    let dataFiltered = [];
                    for (const item of cartItems) {
                        let target = arr.find(thing => thing._id === item.id);
                        target = { ...target, quantity: item.quantity };
                        dataFiltered.push(target);
                    }
                    return dataFiltered;
                } else {
                    return [];
                }
            }
        } else {
            return [];
        }
    }

    const theData = () => {

        const orderDetails = JSON.parse(localStorage.getItem('cart'));
    
        let idu = isAuth()._id;
    
        if(!idu) {
          idu = '';
        }
    
        const orderUpdated = {...data, idUser: idu, promotionCode: promotionCode};
        console.log(data);
        const result = {
          order: orderUpdated,
          orderDetails: orderDetails
        }
        
        return result;
    }

    return (
        <div>
            <Header />
            <TopMenu />
            <div className="container checkout">
            <Title title="Checkout Information" />
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" onChange={(e) => setData({...data, name: e.target.value})}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" onChange={(e) => setData({...data, email: e.target.value})}/>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="text" className="form-control" id="phone" onChange={(e) => setData({...data, phone: e.target.value})}/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" className="form-control" id="address" onChange={(e) => setData({...data, address: e.target.value})}/>
                </div>
                {total > 1 && data.name !== '' && data.email !== '' && data.phone !== '' && data.address !== '' ? <PayPal total={total} description={`Purchase from TechShield, check ${data.email} for more infomation`}
                    dataOrder={theData()}
                /> : ''}
            </div>
        </div>


    );
    }

export default CheckoutPaypal;