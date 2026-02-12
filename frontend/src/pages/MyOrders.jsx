import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IoMdArrowBack } from 'react-icons/io';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';

function MyOrders() {
    const { userData, myOrders } = useSelector((state) => state.user);
    const navigate = useNavigate();
    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
            <div className='w-full max-w-[800px] p-4'>
                <div className='flex items-center gap-[20px] mb-6 '>
                <div
                    className=" z-[10] cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
                </div>
                <h1 className='text-2xl font-bold text-start'>My Orders</h1>
            </div>
                <div className='space-y-6'>
                    {
                        myOrders?.map((order,index)=>(
                            <div key={index}>
                                {userData.role === 'user' && (
                                    <UserOrderCard data={order} key={index} />
                                )}
                                {userData.role === 'owner' && (
                                    <OwnerOrderCard data={order} key={index} />
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default MyOrders