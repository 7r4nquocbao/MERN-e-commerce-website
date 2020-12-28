import React, { useEffect, useState } from 'react';
import TopMenu from '../../../components/UI/TopMenu';
import Headers from '../../../components/UI/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductData } from '../../../slices/product-slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import PayPal from '../../../components/paypal';
import Banner from '../../../components/UI/Banner/MainBanner';
import Images from '../../../constants/images';
import Footer from '../../../components/UI/Footer';
import Badge from '@material-ui/core/Badge';

function Cart(props) {

    const productList = useSelector(state => state.products);
    const codes = useSelector(state => state.promotionCodes);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(1);
    const [codeTemp, setCodeTemp] = useState('');
    const [code, setCode] = useState('');
    const [isPromotion, setIsPromotion] = useState(false);

    useEffect(async () => {
        document.title = 'Cart';
        const result = await dispatch(fetchProductData());
        const filter = filterData(unwrapResult(result));
        let count = 1;
        for (const item of filter) {
            count += item.quantity * (item.price - (item.price * item.sale / 100));
        }
        setTotal(count);
        setData(filter);
    }, []);

    const filterData = (arr) => {
        if (arr) {
            const locCart = localStorage.getItem('cart');
            if (locCart === '') {
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

    const displayCart = () => {
        const cart = localStorage.getItem('cart');
        let cartItems = [];
        if (cart !== '') {
            cartItems = JSON.parse(cart);
        } else {

        }
        if (cartItems) {
            if (cartItems.length === 0) {
                return (
                    <div className="container-fluid full-screen d-flex align-items-center justify-content-center">
                        <div className="text-center">
                            <h1><i className="far fa-square" style={{ fontSize: '10rem' }}></i></h1>
                            <h1>Nothing here.</h1>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="container cart-container">
                        <table class="table table-borderless table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Thubmnail</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Unit price</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayCartItem(data)}
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col">
                                <table>
                                    <tr>
                                        <td>
                                            <h5>Tax</h5>
                                        </td>
                                        <td className="pl-5 text-danger">
                                            <h5>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(calcSum() * 10 / 100)}</h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Shipment and Delivery cost</h5>
                                        </td>
                                        <td className="pl-5 text-danger">
                                            <h5>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(10)} 
                                                <span style={{color: 'gray'}}> / $0 with PayPal</span>
                                            </h5>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div className="col">
                                <div className="d-flex justify-content-between pl-5 pr-5">
                                    <h4>Total</h4>
                                    <h4 className="text-danger">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(calcTotal())}</h4>
                                </div>
                                {checkCode()}
                                <div className="pl-5 pr-5">
                                    <div className="input-group mt-2 mb-4">
                                        <input type="text" className="form-control" placeholder="Enter promotion code here"
                                            onChange={(e) => setCodeTemp(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" onClick={() => setCode(codeTemp.toUpperCase())}>
                                                Check
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <Link to="/checkout/paypal">
                                        <button title="checkout by paypal" style={{width: '200px'}} class="btn btn-success"> <i class="fab fa-cc-paypal mr-1"></i>Paypal</button>
                                    </Link>
                                    <Link to={`/checkout/${code}`}>
                                        <button title="checkout by cash" style={{width: '200px'}} class="btn btn-success"><i class="far fa-credit-card mr-1"></i>Cash</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            }
        } else {
            return (
                <div className="container-fluid full-screen d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h1><i className="far fa-square" style={{ fontSize: '10rem' }}></i></h1>
                        <h1>Nothing here.</h1>
                    </div>
                </div>
            )
        }
    }

    const calcTotal = () => {
        const promotion = codes.find(item => item.code === code);
        if(promotion) {
            return calcSum() + (calcSum() * 10 / 100) + 10 - (calcSum() * promotion.discount / 100);
        } else {
            return calcSum() + (calcSum() * 10 / 100) + 10;
        }
    }

    const checkCode = () => {
        const promotion = codes.find(item => item.code === code.toUpperCase());
        if(promotion) {
            return (
                <div className="d-flex justify-content-between pl-5 pr-5">
                    <h5>Promotion code: {promotion.code}</h5>
                    <h5 className="text-danger">discount {promotion.discount}%</h5>
                </div>
            )
        }
    }

    const displayCartItem = (list) => {
        if (list) {
            return (
                list && list.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <img src={item.thumbnail} style={{ width: '100px' }} alt="img" />
                            </td>
                            <td>{item.name}</td>
                            <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(item.price)}</td>
                            <td>
                                <div className="btn-group" role="group">
                                    <button title="decrease" onClick={() => decreaseItem(item._id)} className="btn btn-danger"><i class="fas fa-minus"></i></button>
                                    <button className="btn btn-light font-weight-bold" style={{ width: '50px' }} disabled>{item.quantity}</button>
                                    <button title="increase" onClick={() => increaseItem(item._id)} className="btn btn-danger"><i class="fas fa-plus"></i></button>
                                </div>
                            </td>
                            <td>
                                <button title="remove" onClick={() => removeItem(item._id)} class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    )
                })
            )
        }
    }

    const calcSum = () => {
        let total = 0;
        if (data) {
            for (const item of data) {
                total += item.quantity * (item.price - (item.price * item.sale / 100))
            }
        }
        return total;
    }

    const increaseItem = (id) => {
        let cartItems = JSON.parse(localStorage.getItem('cart'));
        if (cartItems) {
            let checkIndex = cartItems.findIndex(item => item.id === id);
            let cartUpdated = cartItems;
            let dataUpdated = data;
            if (dataUpdated[checkIndex].quantity < dataUpdated[checkIndex].stock) {
                cartUpdated[checkIndex].quantity++;
                dataUpdated[checkIndex].quantity++;
            }
            localStorage.setItem('cart', JSON.stringify(cartUpdated));
            setData([...dataUpdated]);
        }
    }

    const decreaseItem = (id) => {
        let cartItems = JSON.parse(localStorage.getItem('cart'));
        if (cartItems) {
            let checkIndex = cartItems.findIndex(item => item.id === id);
            let cartUpdated = cartItems;
            let dataUpdated = data;
            if (dataUpdated[checkIndex].quantity > 1) {
                cartUpdated[checkIndex].quantity--;
                dataUpdated[checkIndex].quantity--;
            }
            localStorage.setItem('cart', JSON.stringify(cartUpdated));
            setData([...dataUpdated]);
        }
    }

    const removeItem = (id) => {
        let cartItems = JSON.parse(localStorage.getItem('cart'));
        let cartUpdated = cartItems.filter(item => item.id !== id);
        let dataUpdated = data.filter(item => item._id !== id);
        localStorage.setItem('cart', JSON.stringify(cartUpdated));
        setData([...dataUpdated]);
    }

    return (
        <div>
            <Headers />
            <TopMenu />
            <Banner backgroundUrl={Images.MainBanner} title="Cart" />
            {displayCart()}
            <Footer />
        </div>
    );
}

export default Cart;