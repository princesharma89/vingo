import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setCity } from '../redux/userSlice.js';

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_API_KEY}`
      );
      dispatch(setCity(result?.data?.results[0]?.city));
    });
  }, [userData]);
}

export default useGetCity;
