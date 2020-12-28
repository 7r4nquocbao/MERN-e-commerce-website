import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import '../../HomePage/Product.scss';

CategoryRender.propTypes = {
  data: PropTypes.string,
};
CategoryRender.defaultProps = {
  data: '',
}

function CategoryRender(props) {
  const { data } = props
  const history = useHistory();
  const productList = useSelector(state => state.products)
  const filterProduct = productList.filter(item => item.category === data);

  const onShowDetail = (product) => {

    history.push(`/detail/${product._id}`)
  }

  const displayProduct = (filter) => (
    filter && filter.map((product, index) => {
      return (
        <Col lg="3" md="4" sm="6" xs="12" key={index}>
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
                {/* <div
                  className="product__info__addToCart__button"
                  onClick={() => onAddToCartClick(product)}
                >
                  Add to cart
                      </div> */}
              </div>
            </div>
          </div>
        </Col>
      )
    })
  )

  return (
    <Container>
      <Row>
        {displayProduct(filterProduct)}
      </Row>
    </Container>


  )
}


export default CategoryRender;