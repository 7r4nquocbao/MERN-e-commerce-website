import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../slices/product-slice';
import orderReducer from '../slices/order-slice';
import promotionReducer from '../slices/promotion-slice';
import uiControllerReducer from '../slices/UI-controller-slice';

const rootReducer = {
    products: productReducer,
    orders: orderReducer,
    promotionCodes: promotionReducer,
    uiController: uiControllerReducer
}

const store = configureStore({
    reducer: rootReducer
});

export default store;