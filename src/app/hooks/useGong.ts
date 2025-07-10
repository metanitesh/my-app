// hooks/useGong.ts
import { useEffect, useRef } from "react";
import { Audio } from "expo-av";

export default function useGong() {
  const gong = useRef<Audio.Sound | null>(null);

  // load once
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/gong.mp3"), // static import
        { volume: 1.0 }
      );
      gong.current = sound;
    })();

    // unload on unmount
    return () => {
      gong.current?.unloadAsync();
    };
  }, []);

  /** Play the gong (fire-and-forget). */
  async function play() {
    // -- rewind to start every time
    try {
      await gong.current?.replayAsync();
    } catch (err) {
      console.warn("Gong error:", err);
    }
  }

  return play;
}
