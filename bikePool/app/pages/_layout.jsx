import { Stack, useRouter, useSegments } from 'expo-router';

export default function Layout() {

	return (
		<Stack>
			<Stack.Screen name="BookingPage" options={{ headerShown:false }} />
			<Stack.Screen name="RideTracking" options={{ headerShown:false }} />
			<Stack.Screen name="RideHistory" options={{ headerShown:false }} />
		</Stack>
	);
}