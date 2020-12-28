import { createSlice } from "@reduxjs/toolkit";

const uiControllerSlice = createSlice({
    name: 'uiController',
    initialState: {
        loadingControl: false,
    },
    reducers: {
        setLoading: (state, action) => {
            return {...state, loadingControl: action.payload}
        }
    }
})

const { actions, reducer } = uiControllerSlice;
export const {setLoading} = actions;
export default reducer;
