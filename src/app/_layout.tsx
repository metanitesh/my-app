import "../global.css";
import { Slot, Stack } from "expo-router";
import { BellProvider } from "./BellContext";

// The <Slot /> component is a special Expo Router component that acts as a placeholder
// for rendering the currently active route's component. In this layout file, it means
// that <Slot /> will render the child page (e.g., index.tsx or any nested route) inside
// this layout. This allows you to define shared layout or styling here, and have the
// routed page content appear where <Slot /> is placed.

export default function Layout() {
  return (
    <BellProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Timer Settings", headerShown: false }}
        />
      </Stack>
    </BellProvider>
  );
}
