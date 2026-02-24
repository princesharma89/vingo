import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Nav from "./Nav";
import { serverUrl } from "../App.jsx";
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx";

function DeliveryBoy() {
  const { userData } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [otp, setOtp] = useState("");

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log(result.data);
      

      // Refresh orders after accepting
      const ordersResult = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(ordersResult.data);
      setAvailableAssignments([]);
    } catch (error) {
      console.log("Error in accepting order:", error);
    }
  };
  const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder?.orderId, shopOrderId: currentOrder?.shopOrder?._id },
        { withCredentials: true }
      );
      setShowOtpBox(true);
      console.log(result.data);
      alert(result.data.message);
    } catch (error) {
      console.log("Error in sending OTP:", error);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };
  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        { orderId: currentOrder?.orderId, shopOrderId: currentOrder?.shopOrder?._id, otp },
        { withCredentials: true }
      );
      console.log(result.data);
      alert(result.data.message);
      // Refresh current order after delivery
      const ordersResult = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(ordersResult.data);
      setShowOtpBox(false);
      setOtp("");
    } catch (error) {
      console.log("Error in verifying OTP:", error);
      alert(error.response?.data?.message || "Failed to verify OTP");
    }
  }

  useEffect(() => {
    const getAssignment = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/get-asignment`,
          { withCredentials: true }
        );
        setAvailableAssignments(result.data);
        console.log(result.data);
      } catch (error) {
        console.log("Error in getting assignment:", error);
      }
    };

    const getCurrentOrders = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/get-current-order`,
          { withCredentials: true }
        );
        setCurrentOrder(result.data);
      } catch (error) {
        console.log("Error in getting current orders:", error);
      }
    };

    getAssignment();
    getCurrentOrders();
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      <div className="w-full max-w-200 flex flex-col gap-5 items-center">

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData?.fullName}
          </h1>

          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {userData?.location?.coordinates?.[1]} ,{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {userData?.location?.coordinates?.[0]}
          </p>
        </div>

        {/* Available Orders */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>
            <div className="space-y-4">
              {availableAssignments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No available assignments
                </p>
              ) : (
                <div className="space-y-3">
                  {availableAssignments.map((assignment) => (
                    <div
                      key={assignment.assignmentId}
                      className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{assignment.shopName}</p>
                        <p className="text-sm text-gray-600">
                          Delivery Address: {assignment.deliveryAddress?.text}
                        </p>
                        <p className="text-sm font-bold text-[#ff4d2d]">
                          {assignment.items.length} items ₹{assignment.subTotal}
                        </p>
                      </div>
                      <button
                        className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                        onClick={() => {
                          acceptOrder(assignment.assignmentId);
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            {/* Current order display goes here */}
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">Shop: {currentOrder.shop?.name}</p>
              <p className="text-sm text-gray-500">Customer: {currentOrder.user?.fullName}</p>
              <p>Delivery Address: {currentOrder.deliveryAddress?.text}</p>
              <p className="text-sm font-bold text-[#ff4d2d]">
                {currentOrder.shopOrder?.shopOrderItems?.length} items ₹{currentOrder.shopOrder?.subTotal}
              </p>
            </div>
            <DeliveryBoyTracking data={currentOrder} />
            {!showOtpBox ? <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp}>
              Mark As Delivered
            </button> : <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
              <p className="text-sm font-semibold mb-2">Enter OTP send to <span className="text-orange-500">{currentOrder.user?.fullName}</span></p>
              <input type="text" className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-200 " placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)}/>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all" onClick={verifyOtp}>Submit OTP</button>
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;