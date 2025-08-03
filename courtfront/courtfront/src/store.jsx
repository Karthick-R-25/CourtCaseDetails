import { configureStore } from "@reduxjs/toolkit";
import detailpageReducer from './Components/slices/searchcaseSlice'

const store=configureStore({
    devTools:true,
    reducer:{details:detailpageReducer}
})

export default store