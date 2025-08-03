import {createSlice} from '@reduxjs/toolkit';

let initialState=[]

const detailpage=createSlice({
        name:'casedetail',
        initialState,
        reducers:{
            nowcase(state,action){
                return([action.payload])
            }
        }
})

export const{nowcase}=detailpage.actions

export default detailpage.reducer