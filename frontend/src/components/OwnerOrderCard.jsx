import React from 'react'
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

import { MdLocalPhone } from "react-icons/md";

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch();
  const handleOrderStatus = async (orderId, shopId, status) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({orderId, shopId, status}));
      console.log(response.data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };  


  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div>
        <h2 className='font-semibold text-lg text-gray-800'>
          Customer: {data?.user?.fullName || 'Unknown Customer'}
        </h2>

        {data?.user && (
          <>
            <p className='text-gray-500'>Email: {data.user.email}</p>
            <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
              <MdLocalPhone /> <span>{data.user.mobile}</span>
            </p>
          </>
        )}
      </div>

      <div className='flex items-start gap-2 text-gray-600 text-sm flex-col'>
        {data?.deliveryAddress?.text}

        {data?.deliveryAddress && (
          <p className='text-xs text-gray-500'>
            lat: {data.deliveryAddress.latitude}, lng: {data.deliveryAddress.longitude}
          </p>
        )}
      </div>

      <div className='flex space-x-4 overflow-x-auto pb-2'>
        {data?.shopOrders?.[0]?.shopOrderItems?.map((item, index) => (
          <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
            <img
              src={item?.item?.image}
              alt=""
              className='w-full h-24 object-cover rounded'
            />
            <p className='text-sm font-semibold mt-1'>{item?.name}</p>
            <p className='text-xs text-gray-500'>
              Qty: {item?.quantity} x ₹{item?.price}
            </p>
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
        <span className='text-sm'>
          Status:
          <span className='font-semibold capitalize text-[#ff4d2d]'>
            {data?.shopOrders?.[0]?.status}
          </span>
        </span>

        <select
          className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]'
          onChange={(e) =>
            handleOrderStatus(
              data._id,
              data.shopOrders?.[0]?.shop?._id,
              e.target.value
            )
          }
        >
          <option value="">"Change"</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out for Delivery</option>
        </select>

        <div className='text-right font-bold text-gray-800 text-sm'>
          Total: ₹{data?.shopOrders?.[0]?.subTotal}
        </div>
      </div>
    </div>
  );
}

export default OwnerOrderCard;
