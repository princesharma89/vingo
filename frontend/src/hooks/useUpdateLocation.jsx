import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon }, 
          { withCredentials: true }
        );
        console.log(result.data);
      } catch (error) {
        console.error("Location update failed:", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]); 

}

export default useUpdateLocation;
