import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../../../components/UI/Header';
import { useDispatch, useSelector } from 'react-redux';
import TopMenu from '../../../components/UI/TopMenu';
import { useParams } from 'react-router-dom';
import { Button, Col } from 'reactstrap';
import { fetchProductData } from '../../../slices/product-slice';
import CategoryRender from './CategoryRender';
import MainBanner from '../../../components/UI/Banner/MainBanner';
import Footer from '../../../components/UI/Footer';
import Images from '../../../constants/images';
Category.propTypes = {

};

function Category(props) {
  const { categoryName } = useParams();


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductData())
    document.title = `${categoryName} | Category`;
  }, [dispatch])

  return (
    <div>
      <Header />
      <TopMenu />

      <MainBanner backgroundUrl={Images.Category} title={categoryName} />
      <CategoryRender data={categoryName} />
      <Footer />
    </div>
  );
}

export default Category;