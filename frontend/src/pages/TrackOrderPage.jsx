import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

import { IoMdArrowBack } from "react-icons/io";

import { serverUrl } from '../App.jsx';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking.jsx';


function TrackOrderPage() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState(null);
    useEffect(() => {
        const handleGetOrder = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
                console.log("Order data:", result.data);
                console.log("Shop orders:", result.data.shopOrders);
                setCurrentOrder(result.data);
            } catch (error) {
                console.log("Error in getting order details:", error);
            }
        }
        handleGetOrder();
    }, [orderId]);

    return (
        <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
            <div
                className="relative flex items-center left-5 top-5 z-10 mb-2.5"
            >
                <IoMdArrowBack size={35} className="text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/")} />
                <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
            </div>

            {!currentOrder ? (
                <div className='text-center py-10'>
                    <p className='text-gray-500'>Loading order...</p>
                </div>
            ) : (
                <>
                    {/* Order Header Info */}
                    <div className='bg-white p-4 rounded-2xl shadow-md border border-orange-100'>
                        <h2 className='font-bold text-lg mb-2'>Order Details</h2>
                        <div className='space-y-1 text-sm'>
                            <p><span className='font-semibold'>Order ID:</span> {currentOrder._id}</p>
                            <p><span className='font-semibold'>Payment Method:</span> <span className='uppercase'>{currentOrder.paymentMethod}</span></p>
                            <p><span className='font-semibold'>Total Amount:</span> ₹{currentOrder.totalAmount}</p>
                        </div>
                    </div>

                    {/* Shop Orders */}
                    {currentOrder.shopOrders?.map((shopOrder, index) => (
                        <div key={index} className='bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4'>
                            <p className='font-bold text-lg mb-2'>Shop: {shopOrder.shop?.name || 'Unknown Shop'}</p>
                            
                            <div className='space-y-2'>
                                <p className='font-semibold'>Items:</p>
                                {shopOrder.shopOrderItems?.length > 0 ? (
                                    shopOrder.shopOrderItems.map((orderItem, idx) => (
                                        <div key={idx} className='flex justify-between items-center text-sm border-b pb-2'>
                                            <span>{orderItem.name || orderItem.item?.name || 'Item'} x {orderItem.quantity}</span>
                                            <span className='font-semibold'>₹{orderItem.price}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-500 text-sm'>No items found</p>
                                )}
                            </div>
                            
                            <div className='border-t pt-3'>
                                <p className='text-sm text-gray-600'>
                                    Status: <span className='capitalize font-semibold text-[#ff4d2d]'>{shopOrder.status}</span>
                                </p>
                                <p className='text-lg font-bold text-[#ff4d2d] mt-2'>Total: ₹{shopOrder.subTotal}</p>
                            </div>
                            
                            <div className='border-t pt-3'>
                                <p className='mb-2'><span className='font-semibold'>Delivery Address:</span></p>
                                <p className='text-sm text-gray-700'>{currentOrder?.deliveryAddress?.text || 'No address provided'}</p>
                            </div>
                            
                            {shopOrder.status !== "delivered" ? (
                                <div className='border-t pt-3'>
                                    <h2 className='font-semibold text-lg mb-2'>Delivery Boy</h2>
                                    {shopOrder.assignedDeliveryBoy ? (
                                        <div className="text-sm text-gray-700 space-y-1 bg-orange-50 p-3 rounded-lg">
                                            <p className='font-semibold'>Name: {shopOrder.assignedDeliveryBoy.fullName}</p>
                                            <p className='font-semibold'>Mobile: {shopOrder.assignedDeliveryBoy.mobile}</p>
                                        </div>
                                    ) : (
                                        <p className='text-gray-500 text-sm bg-gray-50 p-3 rounded-lg'>No delivery boy assigned yet</p>
                                    )}
                                    {shopOrder.assignedDeliveryBoy && 
                                    <div className='mt-4'>
                                        <DeliveryBoyTracking data={{
                                            deliveryBoyLocation:{
                                                lat: shopOrder.assignedDeliveryBoy.location?.coordinates?.[1],
                                                lng: shopOrder.assignedDeliveryBoy.location?.coordinates?.[0],
                                            },
                                            customerLocation:{
                                                lat: currentOrder.deliveryAddress?.latitude,
                                                lng: currentOrder.deliveryAddress?.longitude,
                                            }
                                        }}/>
                                    </div>}
                                </div>
                            ) : (
                                <div className='border-t pt-3'>
                                    <p className='text-green-600 font-semibold text-lg'>✓ Delivered</p>
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default TrackOrderPage