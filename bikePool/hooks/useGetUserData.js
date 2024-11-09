import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetUserData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLoggedInUser = async () => {
            try{
                const accessToken = await AsyncStorage.getItem("accessToken");
                if(!accessToken){
                    throw new Error("No access token found");
                }

                const res = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/users/get-current-user`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUser(res.data.data);
            } catch(err){
                console.log("Error getting logged in user", err);
            } finally {
                setLoading(false);
            }
        };
        getLoggedInUser();
    }, []);
    return { loading, user };
}