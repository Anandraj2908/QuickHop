import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
  );
}

// import { Stack, useRouter, useSegments } from 'expo-router';

// export default function RootLayout() {

// 	return (
// 		<Stack>
// 			<Stack.Screen name="index" options={{ title: 'Entry' }} />
// 			<Stack.Screen name="authentication" options={{ title: 'Auth Page' }} />
// 			<Stack.Screen name="pages" options={{ title: 'Pages' }} />
// 		</Stack>
// 	);
// }