import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Col, Container } from 'reactstrap';
import './TopMenu.scss';
import topLogo from '../../../assets/Images/logo-no-title.png';
import dataCategories from '../../../constants/local-db.json';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Badge } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../slices/UI-controller-slice';
import {uiLoading} from '../../../App.js';

function TopMenu(props) {

  const categories = dataCategories.categories;
  const dispatch = useDispatch();

  function getQuantity() {
    const locCart = localStorage.getItem('cart');
    if (locCart === '') {
      return 0;
    } else {
      const cart = JSON.parse(localStorage.getItem('cart'));
      let count = 0;
      cart && cart.forEach(item => {
        count += item.quantity
      })
      return count;
    }
  }

  return (
    <Container>
      <div className="menu">
        <div className="menu__logo">

          <NavLink
            title="logo"
            to="/"
            className="menu__link menu__logo"
          >
            <img alt="logo" src={topLogo} width='60px' />
          </NavLink>

        </div>
        <div className="menu__center">

          <Col sm="auto">
            <NavLink
              title="home"
              exact
              to="/"
              className="menu__link"
              activeClassName="menu__link--active"
            >
              Home
        </NavLink>
          </Col>
          <Col sm="auto" className=" menu__link menu__center__has-subMenu">
            Products

            <ul className="menu__center__has-subMenu__subMenu">
              {
                categories.map((category, index) => (
                  <Link title={category.name} to={`/category/${category.name}`}>
                    <li
                      key={index}
                      className="menu__link"
                    >{category.name}</li>
                  </Link>

                ))
              }
            </ul>

          </Col>
          <Col sm="auto">
            <NavLink
              title="user's information"
              exact
              to="/profile"
              className="menu__link menu__hasSub"
              activeClassName="menu__link--active"
            >
              User
          </NavLink>
          </Col>
          <Col sm="auto">
            <NavLink
              title="user's information"
              exact
              to="/admin"
              className="menu__link menu__hasSub"
              activeClassName="menu__link--active"
            >
              Admin
          </NavLink>
          </Col>
        </div>
        <div className="menu__function">
          <Col sm="auto">
            <NavLink
              title="search"
              exact
              to="/search"
              className="menu__link menu__function__search"
              activeClassName="menu__link--active"
            >
              <i class="fas fa-search"></i>
            </NavLink>
          </Col>
          <Col sm="auto">
            <NavLink
              title="shopping cart"
              exact
              to="/cart"
              className="menu__link menu__function__cart"
              activeClassName="menu__link--active"
            >
              <Badge badgeContent={getQuantity()} color="primary">
                <ShoppingCartIcon />
              </Badge>
              <span className="ml-2">Cart</span>
            </NavLink>
          </Col>
        </div>
      </div>

    </Container>
  );
};

export default TopMenu;