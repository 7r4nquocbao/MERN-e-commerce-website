import React, { useEffect, useState } from 'react';
import ProductTable from '../../components/admin/product-table';
import { createProduct, deleteProduct, fetchProductData } from '../../slices/product-slice';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MessageIcon from '@material-ui/icons/Message';
import MoneyIcon from '@material-ui/icons/Money';
import OrderList from '../../components/admin/order-list';
import './style.scss';
import ChatApp from '../../components/admin/chat-app';
import { fetchOrderData } from '../../slices/order-slice';
import { useDispatch } from 'react-redux';
import UserTable from '../../components/admin/user-table';
import { readUser } from '../../api';
import { getCookie, isAuth, signOut } from '../../helpers/auth';
import { useHistory } from 'react-router-dom';
import { createPromotionCode, fetchCodeData } from '../../slices/promotion-slice';
import Promotion from '../../components/admin/promotion-code';
import { uiLoading } from '../../App';

const useStyles = makeStyles({
    root: {
        color: "green",
        "&$selected": {
          color: "red"
        }
      },
      selected: {}
})

function Admin(props) {

    const classes = useStyles();

    const dispatch = useDispatch();
    const history = useHistory();

    const [recentPage, setRecentPage] = useState('Products');
    const handleChange = (event, newValue) => {
        setRecentPage(newValue);
    };

    useEffect(() => {
        document.title = 'Admin Side';
        const token = getCookie('token');
        readUser(isAuth()._id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if(res.data.role === 'admin') {
                dispatch(fetchOrderData());
                dispatch(fetchProductData());
                dispatch(fetchCodeData());
            } else {
                history.push('/');
            }
        }).catch(err => {
            history.push('/');
        })
    }, []);

    const displayContent = () => {
        switch (recentPage) {
            case 'Products':
                return <ProductTable />;
            case 'Orders':
                return <OrderList />;
            case 'Users':
                return <UserTable />;
            case 'Messages':
                return <ChatApp />;
            case 'Promotions':
                return <Promotion />
            case 'Logout':
                signOut();
                history.push('/');
                
        }
    }

    return (
        <div className="App container mt-5">
            <h1>App.</h1>
            {displayContent()}
            <BottomNavigation value={recentPage} classes={classes.root} color="secondary" onChange={handleChange} className="fixed-bottom">
                <BottomNavigationAction classes={classes.root} label="Products" value="Products" icon={<StorageRoundedIcon />}/>
                <BottomNavigationAction classes={classes.root} label="Orders" value="Orders" icon={<ReceiptIcon />} />
                <BottomNavigationAction classes={classes.root} label="Users" value="Users" icon={<PeopleAltIcon />} />
                <BottomNavigationAction classes={classes.root} label="Messages" value="Messages" icon={<MessageIcon />} />
                <BottomNavigationAction classes={classes.root} label="Promotions" value="Promotions" icon={<MoneyIcon />} />
                <BottomNavigationAction classes={classes.root} label="Logout" value="Logout" icon={<PowerSettingsNewRoundedIcon />} />
            </BottomNavigation>
        </div>
    )
}

export default Admin;