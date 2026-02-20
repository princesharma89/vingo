import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Nav from "./Nav";
import { serverUrl } from "../App.jsx";

function DeliveryBoy() {
  const { userData } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);

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

    getAssignment();
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
        <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
          <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
            Available Orders
          </h1>
          <div className="space-y-4">
            {availableAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No available assignments</p>
          ) : (
            <div className="space-y-3">
              {availableAssignments.map((assignment) => (
                <div key={assignment.assignmentId} className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                  <p className="font-semibold">{assignment.shopName}</p>
                  <p className="text-sm text-gray-600">Delivery Address:  {assignment.deliveryAddress?.text}</p>
                  <p className="text-sm font-bold text-[#ff4d2d]">{assignment.items.length} items ₹{assignment.subTotal}</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600">Accept</button>
                </div>
              ))}
            </div>
          )}
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default DeliveryBoy;