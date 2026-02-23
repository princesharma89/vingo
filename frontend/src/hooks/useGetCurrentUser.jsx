import axios from 'axios';
import React, { useEffect } from 'react';

import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log('error in fetching current user', error);
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;