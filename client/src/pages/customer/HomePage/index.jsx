import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Product.scss';

import Headers from '../../../components/UI/Header';
import TopMenu from '../../../components/UI/TopMenu';
import Banner from '../../../components/UI/Banner/MainBanner';
import Footer from '../../../components/UI/Footer';
import Title from '../../../components/UI/Title';

import Images from '../../../constants/images';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductData } from '../../../slices/product-slice';
import { Col, Container } from 'reactstrap';
import { Button } from 'reactstrap';
import { Row } from 'reactstrap';
import ChatBox from '../../../components/UI/Chatbox';

import { useHistory, useParams } from 'react-router-dom';
import SlideShow from '../../../components/UI/Carousel';
import Commitment from '../../../components/UI/Commitment';

HomePage.propTypes = {

};

function HomePage(props) {

  const itemOnPage = 8;
  const [page, setPage] = useState(1);

  const { productID } = useParams();
  const history = useHistory();

  const productList = useSelector(state => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductData());
    document.title = 'Tech Shield | Homepage';
  }, [])

  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));

  const onAddToCartClick = (item) => {

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems === []) {
      let newItem = { id: item._id, quantity: 1 };
      cartItems.push(newItem);
    } else {
      let checkExists = cartItems.findIndex(cartItem => cartItem.id === item._id);
      if (checkExists !== -1) {
        cartItems[checkExists].quantity += 1;
      } else {
        let newItem = { id: item._id, quantity: 1 };
        cartItems.push(newItem);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCart([...cartItems]);
  }

  const onShowDetail = (product) => {

    history.push(`/detail/${product._id}`)
  }
  const displayProductList = (product, page) => {
    const start = (page - 1) * itemOnPage;
    const productOnPage = product.slice(start, start + itemOnPage);

    return (
      productOnPage && productOnPage.map(product => {

        if(product.isEnable) {
          return(
          <Col lg="3" md="4" sm="6" xs="12">
            <div className="product mb-5">
              <div className="product__image">
                <Button
                  title="show detail"
                  color="link"
                  onClick={() => onShowDetail(product)}
                >
                  <img alt="product picture" src={product.thumbnail} />
                </Button>
              </div>

              <div className="product__info">
                <div className="product__info__title">{product.name}</div>
                <div className="product__info__addToCart">
                  <div className="product__info__addToCart__price">{`${product.price}$`}</div>
                  <div
                    title="add to cart"
                    className="product__info__addToCart__button"
                    onClick={() => onAddToCartClick(product)}
                  >
                    Add to cart
                        </div>
                </div>

              </div>
            </div>
          </Col>
          )
       }
      }
    ))
  }
  const calcPagination = () => {

    let arrPageNums = [];
    for (let index = 1; index <= Math.ceil(productList.length / itemOnPage); index++) {
      arrPageNums.push(index);
    }

    return (
      arrPageNums.map(item => {
        return (
          <li className={`page-item  ${item === page ? 'active' : ''}`} key={item}>
            <button className="page-link" onClick={() => setPage(item)}>{item}</button>
          </li>
        )
      })
    )
  }

  return (
    <div className="HomePage">
      <Headers />
      <TopMenu />
      <SlideShow />
      <hr />
      <div className="product-list">
        <Container>
          <Title title="Products" />
          <Row>
            {displayProductList(productList, page)}
          </Row>
          <div className="d-flex justify-content-center">
            <ul className="pagination justify-content-end">
              <li className={`page-item text-secondary ${page > 1 ? '' : 'disabled'}`}>
                <button color="danger" title="prev page" className="page-link " onClick={() => setPage(page - 1)}>Prev</button>
              </li>
              {calcPagination()}
              <li className={`page-item ${page < Math.ceil(productList.length / itemOnPage) ? '' : 'disabled'}`}>
                <button title="next page" className="page-link text-danger" onClick={() => setPage(page + 1)}>Next</button>
              </li>
            </ul>
          </div>

        </Container>
        <Commitment />
        <ChatBox />
        <Footer />
      </div>

    </div>
  );
}

export default HomePage;