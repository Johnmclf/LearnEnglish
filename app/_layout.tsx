import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Lobby" }} />
      <Stack.Screen name="ajouter" options={{ title: "Manage word" }} />
      <Stack.Screen name="liste" options={{ title: "View word" }} />
      <Stack.Screen name="test" options={{ title: "Test yourself" }} />
    </Stack>
  );
}
