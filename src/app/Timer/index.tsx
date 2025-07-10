import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useBellContext } from "../BellContext";
import useGong from "../hooks/useGong";

// Helper to parse "MM:SS" or "HH:MM:SS" to seconds
function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) {
    // MM:SS
    const [mm, ss] = parts;
    return mm * 60 + ss;
  } else if (parts.length === 3) {
    // HH:MM:SS
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }
  return 0;
}

// Helper to convert seconds to "HH:MM:SS" or "MM:SS" string
function formatSecondsToTimeString(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  } else {
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }
}

export default function TimerScreen() {
  // Get duration from router params (as string, e.g. "25:00")
  const params = useLocalSearchParams();
  const durationStr =
    typeof params.duration === "string" ? params.duration : "25:00";
  const initialSeconds = parseDurationToSeconds(durationStr);

  // Read bells from context
  const { bellEntries } = useBellContext();

  // Prepare bell times in seconds, sorted ascending
  const bellTimes = React.useMemo(() => {
    return bellEntries
      .map((b) => ({
        ...b,
        seconds: parseDurationToSeconds(b.time),
      }))
      .filter((b) => !isNaN(b.seconds))
      .sort((a, b) => a.seconds - b.seconds);
  }, [bellEntries]);

  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  // Track which bells have already been played
  const rungBellIdsRef = useRef<Set<number>>(new Set());

  // Gong sound hook
  const playGong = useGong();

  // Reset timer and rung bells when duration changes
  useEffect(() => {
    setTimeRemaining(initialSeconds);
    rungBellIdsRef.current = new Set();
  }, [initialSeconds, bellEntries]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  // Play gong at correct bell intervals and at session end
  useEffect(() => {
    if (!isRunning) return;

    // Bells: play gong if any bell matches current time
    for (const bell of bellTimes) {
      // Bell should ring when timeRemaining matches bell's time
      // Bell time is in seconds from start, so we want to ring when
      // timeRemaining === (initialSeconds - bell.seconds)
      const bellTriggerTime = initialSeconds - bell.seconds;
      if (
        timeRemaining === bellTriggerTime &&
        !rungBellIdsRef.current.has(bell.id)
      ) {
        playGong();
        rungBellIdsRef.current.add(bell.id);
      }
    }

    // Session end: play gong when timer hits 0
    if (timeRemaining === 0) {
      playGong();
    }
  }, [timeRemaining, isRunning, bellTimes, initialSeconds, playGong]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View className="items-center pt-10 pb-5">
        <Text className="text-zinc-400 text-base font-normal">Meditation</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-between px-5">
        {/* Timer Section */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-zinc-400 text-xl mb-8">Sakya</Text>
          <Text className="text-white text-7xl font-extralight mb-5">
            {formatTime(timeRemaining)}
          </Text>
          <Text className="text-zinc-500 text-base">
            {bellEntries.length} bell{bellEntries.length !== 1 ? "s" : ""}{" "}
            remaining
          </Text>
        </View>

        {/* Controls Section */}
        <View className="items-center pb-24">
          <TouchableOpacity
            className="w-20 h-20 rounded-full bg-transparent justify-center items-center"
            onPress={toggleTimer}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center space-x-2">
              <View className="w-1.5 h-7.5 bg-white rounded-full" />
              <View className="w-1.5 h-7.5 bg-white rounded-full" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
