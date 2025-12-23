import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
function SignIn() {
    const primaryColor = '#ff4d2d'
    const hoverColor = '#e64323'
    const bgColor = '#fff9f6'
    const borderColor = '#ddd'
    const [showPassword, setShowPassword]=useState(false);
    const navigate=useNavigate();
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const handleSignIn=async()=>{
        try{
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,
                password,
            },{
                withCredentials:true,
            }
        );
        console.log("signin successful",result);
        }
        catch(error){
            console.log("failed in fetching data for signin",error);

        }
    }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4'style={{backgroundColor: bgColor}}>
        <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `}
        style={{
            border:`1px solid ${borderColor}`,
        }}>
            <h1 className={`text-3xl font-bold mb-2 `}
            style={{color: primaryColor}}>
                Vingo
            </h1>
            <p className='text-gray-600 mb-8'>
                Sign in to your account to continue enjoying delicious food deliveries.
            </p>
           
            {/*email*/}
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font -medium mb-1">
                    Email
                </label>
                <input type="email" className='w-full border rounded-lg px-3 py-2' placeholder='Enter your Full Email' style={{color: borderColor}}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }} value={email}/>
            </div>
           
            {/*password*/}
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font -medium mb-1">
                    Password
                </label>
                <div className='relative'>
                <input type={showPassword ? "text" : "password"} className='w-full border rounded-lg px-3 py-2 ' placeholder='Enter your Password'style={{color: borderColor}}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }} value={password}/>
                <button className='absolute right-3 cursor-pointer top-[14px] text-gray-500' onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword?<FaRegEye />:<FaRegEyeSlash />}</button>
                </div>
            </div>
            <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer font-medium' onClick={() => navigate('/forgot-password')}>
              Forgot password
            </div>

           
            <button className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]cursor-pointer`}
            onClick={handleSignIn}>
                sign In
            </button>
            <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 cursor-pointer border-gray-400 hover:bg-gray-100'>
                <FcGoogle size={20} />
                <span>Sign In with Google</span>
            </button>
            <p className='text-center mt-6'>Want to create a new account ?<span className='text-[#ff4d2d] cursor-pointer' onClick={() => navigate('/Signup')}>sign Up</span></p>
        </div>
    </div>
  )
}

export default SignIn