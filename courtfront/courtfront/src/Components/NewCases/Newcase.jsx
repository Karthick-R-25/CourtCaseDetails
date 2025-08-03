import React, { useState, useRef, useEffect } from "react";
import { caseTypes } from "./datacase";
import './Newcase.css'
import { nowcase } from "../slices/searchcaseSlice";
import {useDispatch} from 'react-redux'
import { useNavigate } from "react-router-dom";

function Newcase() {
    const caseTypeRef = useRef()
    const caseNumberRef = useRef()
    const[submits,setSubmit]=useState('')
    const filingRef = useRef()
   const [captchaText, setCaptchaText] = useState('loading..');
    const captchaTextRef=useRef()
    const dispatch=useDispatch()
    const Navigate=useNavigate()


    useEffect(() => {
  fetchCaptcha(); 
}, []);


    const fetchCaptcha = async () => {
  try {
    const response = await fetch('http://localhost:3000/getcaptcha');
    const data = await response.json();
    setCaptchaText(data.captcha);
    console.log("Captcha fetched:", data.captcha);
  } catch (error) {
    setCaptchaText('Relaod captcha');
    console.error("Failed to fetch captcha:", error);
  }
};


    const handlesubmit = async (e) => {
        e.preventDefault()
        setSubmit('Successfully Submitted!')
        const formdata = {
            caseNumber: caseNumberRef.current.value,
            caseType: caseTypeRef.current.value,
            filingYear: filingRef.current.value,
            captchaText:captchaTextRef.current.value
        };
        console.log(formdata)
        let posted = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:JSON.stringify(formdata)
        }
        try {
             setSubmit('loading!! please wait....')
            let response = await fetch('http://localhost:3000/casesubmit',posted)
            let data = await response.json()
            
            dispatch(nowcase(data))
            Navigate('/Details')
            console.log(data)
        }
        catch (err) {
            console.log(err)
            setSubmit(err.details)
        }
    }
   
      

    return (
        <div >
            <form onSubmit={handlesubmit} className="new1">
                <select ref={caseTypeRef}>
                {caseTypes.map((val,idx)=>{
                    return(<option value={val} key={idx} >{val}</option>)})
                }
                </select>
                <input type="number"  ref={caseNumberRef} placeholder="Enter Case Number" required />
                <input ref={filingRef} type="number" placeholder="Enter Filing Year" min="1900" max={new Date().getFullYear()} required />
                <div className="captch-but">
               
                <button className="cap-but"  id="captchaText">{captchaText}</button>
                <button className="cap-3" onClick={ fetchCaptcha}>🔄</button></div>
              
                       
                        <input ref={captchaTextRef} name="captcha" placeholder="Enter Captcha Text"  />
                  
                

                <button className="sub-but" type="submit">Submit</button>
                <p className="status1">{submits}</p>
            </form>
        </div>
    )

}

export default Newcase