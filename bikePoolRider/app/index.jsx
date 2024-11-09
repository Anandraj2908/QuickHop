import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  return <Redirect href={!isLoggedIn ? "/(routes)/login" : "/(tabs)/home"} />;
}
