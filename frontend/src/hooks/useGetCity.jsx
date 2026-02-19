import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentCity,setCurrentState, setUserData  } from '../redux/userSlice.js';
import { setLocation,setAddress } from '../redux/mapSlice.js';
function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEO_API_KEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      dispatch(setLocation({lat: latitude, lon: longitude}));
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      dispatch(setCurrentCity(result?.data?.results[0]?.city || result?.data?.results[0]?.county));
      dispatch(setCurrentState(result?.data?.results[0]?.state));
      dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1));      
      dispatch(setAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1));
    });
  }, [userData]);
}

export default useGetCity;
