import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import { createComment, getComments } from '../../../api';
import Banner from '../../../components/UI/Banner/MainBanner';
import Footer from '../../../components/UI/Footer';
import Header from '../../../components/UI/Header';
import Title from '../../../components/UI/Title';
import TopMenu from '../../../components/UI/TopMenu';
import Images from '../../../constants/images';
import { isAuth } from '../../../helpers/auth';
import { fetchProductData } from '../../../slices/product-slice';
import './Details.scss';



Detail.propTypes = {

};

function Detail(props) {

  const handleDragStart = (e) => e.preventDefault();

  const codes = useSelector(state => state.promotionCodes);

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  const { productID } = useParams();

  const [productList, setProductList] = useState([]);

  const [product, setProduct] = useState({});
  const [specs, setSpecs] = useState([]);
  const [cart, setCart] = useState([]);
  const [star, setStar] = useState(5);
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [relative, setRelative] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    const result = await dispatch(fetchProductData());
    setProductList(unwrapResult(result));
    const filter = filterProduct(unwrapResult(result));
    setProduct(filter);
    const specList = filter.description;
    if (specList) {
      setSpecs(JSON.parse(specList));
    }
    getComments(productID).then(res => {
      console.log(res);
      setComments(res.data);
    }).catch(err => {
      console.log(err);
    })
    window.scrollTo(0, 0);
    document.title = filter.name;

    console.log(codes);

  }, [])

  const postComment = () => {
    const idUser = isAuth()._id || '';
    const idProduct = productID;
    const name = isAuth().name || '';
    const newComment = { idUser, idProduct, star, content, name };
    createComment(newComment).then(res => {
      setComments(res.data);
    }).catch(err => {
      console.log(err);
    });
    setContent('');
    setStar(5);
  }

  const filterProduct = (product) => {
    return product.find(item => item._id === productID);
  }

  const handleAddToCart = (item) => {

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
  const displaySpecs = () => {
    return (
      specs && specs.map((item, index) => {
        return (
          <tr key={index}>
            <td>{item.type}</td>
            <td>{item.content}</td>
          </tr>
        )
      })
    )
  }

  const displayComments = () => {
    if (comments && comments !== []) {
      return (
        comments.map((item, index) => {
          return (
            <div className="comment-item m-1 p-3" key={index}>
              <Rating
                style={{ fontSize: '20px' }}
                name="simple-controlled"
                value={item.star}
                disabled={true} />
              <h6 className="font-italic">{item.name}</h6>
              <h6>{item.content}</h6>
            </div>
          )
        })
      )
    }
  }

  const caclStar = () => {
    if (comments !== []) {
      let starSum = 0;
      for (const comment of comments) {
        starSum += comment.star;
      }
      let starAvg = starSum / comments.length;
      return starAvg.toFixed(1);
    } else {
      return 0;
    }
  }

  const handleShowDetail = (product) => {
    history.push(`/detail/${product}`)
    window.location.reload();
  }

  const displayRelative = () => {
    const relativeList = productList.filter(item => item.category === product.category);
    let array = [];
    for (const item of relativeList) {
      array.push(
        <div>
          <img alt="product related" src={item.thumbnail} style={{ width: '200px' }} onDragStart={handleDragStart} onClick={() => handleShowDetail(item._id)} />
          <p>{item.name}</p>
        </div>
      );
    }
    console.log(array);
    return (
      <AliceCarousel items={array} infinite responsive={responsive} mouseTracking disableButtonsControls />
    )
  }

  const displayCodes = () => {
    return (
      codes && codes.map(item => {
        const s = new Date(item.startDate);
        const e = new Date(item.endDate);
        const n = new Date();
        if(n >= s && n <= e) {
          return (
            <p>Use code: <strong>{item.code}</strong> to discount {item.discount}%.</p>
          )
        }
      })
    )
  }

  return (
    <div>
      <Header />
      <TopMenu />
      <Banner title="Product's Detail" backgroundUrl={Images.Category} />

      <Container>
        <div className="product-detail">
          <div className="product-detail__img">
            <ReactImageMagnify className="zoom" {...{
              smallImage: {
                alt: `${product.name}`,
                isFluidWidth: true,
                // width: '100%',
                // height: 'auto',
                src: `${product.thumbnail}`
              },
              largeImage: {
                src: `${product.thumbnail}`,
                width: 1200,
                height: 1800
              },
              isHintEnabled: true,
              shouldHideHintAfterFirstActivation: false
            }} />
          </div>
          <div className="product-detail__info">
            <div className="detail-title">
              <p>{product.name}</p>
            </div>
            <div className="detail-info">
              <p>{product.descriptionDetail}</p>
            </div>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating name="read-only" value={caclStar()} readOnly precision={0.1}
                style={{ fontSize: '40px', pointerEvents: 'none' }}
              />
            </Box>
            <div className="detail-price">
              <p>{`${product.price}$`}</p>
            </div>
            {displayCodes()}
            <Button
              title="add to cart"
              className="btn-addToCart"
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </Button>
          </div>
        </div>

        <hr />
        <Title title="Related Products" />
        <div className="related-products">
          {displayRelative()}
        </div>
        <hr />
        <Title title="Details" />
        <div className="table-detail">
          <Table striped>
            <tbody>
              {displaySpecs()}
            </tbody>
          </Table>
        </div>
        <hr />
        <Title title="Customer's Evaluate" />
        <div className="form-floating">
          <textarea className="form-control" style={{ height: '100px' }} placeholder='Comment'
            onChange={(e) => setContent(e.target.value)} value={content}
          />
        </div>
        <div>
          <Rating
            style={{ fontSize: '40px' }}
            name="simple-controlled"
            value={star}
            onChange={(event, newValue) => {
              setStar(newValue);
            }}
          />
        </div>
        <button title="comment" className="btn btn-light mt-3 mb-5" onClick={() => postComment()}>Comment</button>

        <div className="mb-5">
          {displayComments()}
        </div>

      </Container>
      <Footer />
    </div >

  );
}

export default Detail;