import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import { serverUrl } from '../App.jsx';
import { setUserData,setCity } from '../redux/userSlice.js';

function Nav() {
  const { userData ,city} = useSelector((state) => state.user);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
  try {
    const result= await axios.get(`${serverUrl}/api/auth/signout`, {
      withCredentials: true,
    });
    dispatch(setUserData(null));
    dispatch(setCity(null));
  } catch (error) {
    console.log('error in logout', error);
  }
};

  return (
    <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 left-0 z-[999] bg-[#fff9f6] overflow-visible'>
      {showSearch && <div className='w-[90%]  h-[70px]  bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[70px] left-[5%] md:hidden z-[999]'>
        {/* location */}
        <div className='flex items-center w-[30%] overflow-hidden gap-[10px] border-r-[2px] border-gray-400 '>
          <FaLocationDot size={25} className=' text-[#ff4d2d]' />
          <div className='w-[80%] truncate text-gray-600'>{city}</div>
        </div>
        {/* search */}
        <div className='w-[80%] flex items-center gap-[10px] '>
          <FaSearch size={25} className='text-[#ff4d2d]'  />
          <input type="text" placeholder='search delicious food...' className='w-full px-[10px] text-gray-700 outline-0' />
        </div>
      </div>}
      <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Vingo</h1>
      {/* search bar */}
      <div className=' md:w-[60%] lg:w-[40%] h-[70px] bg-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
        {/* location */}
        <div className='flex items-center w-[30%] overflow-hidden gap-[10px] border-r-[2px] border-gray-400 '>
          <FaLocationDot size={25} className=' text-[#ff4d2d]' />
          <div className='w-[80%] truncate text-gray-600'>{city}</div>
        </div>
        {/* search */}
        <div className='w-[80%] flex items-center gap-[10px] '>
          <FaSearch size={25} className='text-[#ff4d2d]' />
          <input type="text" placeholder='search delicious food...' className='w-full px-[10px] text-gray-700 outline-0' />
        </div>
      </div>
      <div className='flex items-center gap-4'>
        {showSearch? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() => setShowSearch(false)} />:<FaSearch size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() =>
          setShowSearch(true)
        }/>}
        
        {/* cart */}
        <div className='relative cursor-pointer'>
          <IoCartOutline size={25} className='text-[#ff4d2d]' />
          <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d]'>0</span>
        </div>
        {/*My Order Button*/}
        <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'>
          My Order
        </button>
        {/*profile */}
        <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center  bg-[#ff4d2d] text-white text-[18px] font-semibold cursor-pointer' onClick={() => setShowInfo(prev => !prev)}>
          {userData?.fullName.slice(0, 1).toUpperCase()}
        </div>
        {showInfo && <div className='fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[999]'>
          <div className='text-[17px] font-semibold'>{userData?.fullName}</div>
          <div className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer'>My Orders</div>
          <div className='text-[#ff4d2d] font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</div>
        </div>}
      </div>

    </div>
  )
}

export default Nav