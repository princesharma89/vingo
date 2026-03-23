import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { IoMdArrowBack } from 'react-icons/io';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
    const { userData, myOrders,socket } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        const onNewOrder = (data) => {
            if(data.shopOrders.owner._id === userData._id){
                dispatch(setMyOrders([data,...myOrders]));
            }
        };

        const onUpdateStatus = ({ orderId, shopId, status, userId }) => {
            if (String(userId) === String(userData?._id)) {
                dispatch(updateRealtimeOrderStatus({ orderId, shopId: String(shopId), status }));
            }
        };

        socket?.on('newOrder', onNewOrder)
        socket?.on('update-status', onUpdateStatus)
        return ()=>{
            socket?.off('newOrder', onNewOrder);
            socket?.off('update-status', onUpdateStatus);
        }
    }, [dispatch, myOrders, socket, userData?._id])
    
    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
            <div className='w-full max-w-200 p-4'>
                <div className='flex items-center gap-5 mb-6 '>
                <div
                    className=" z-10 cursor-pointer"
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