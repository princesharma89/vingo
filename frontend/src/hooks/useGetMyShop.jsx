import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';


function useGetMyShop() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log('error in fetching current user', error);
      }
    };
    fetchShop();
  }, []);
}

export default useGetMyShop;