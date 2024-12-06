import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGetDriverData = () => {
  const [driver, setDriver] = useState(null); // Set initial type as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoggedInDriverData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const res = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/riders/get-current-rider`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDriver(res.data.data);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      } finally {
        setLoading(false);
      }
    };

    getLoggedInDriverData();
  }, []);

  return { loading, driver };
};
