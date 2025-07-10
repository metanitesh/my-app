import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

// Helper function to format time as "HH:MM:SS"
const formatTime = ({ hours, minutes, seconds }) => {
  const timeParts = [];
  if (hours !== undefined) {
    timeParts.push(hours.toString().padStart(2, "0"));
  }
  if (minutes !== undefined) {
    timeParts.push(minutes.toString().padStart(2, "0"));
  }
  if (seconds !== undefined) {
    timeParts.push(seconds.toString().padStart(2, "0"));
  }
  return timeParts.join(":");
};

const bowls = [
  { id: 0, name: "Rigzé" },
  { id: 1, name: "Sakya" },
  { id: 2, name: "Om" },
];

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("Timer");
  const [selectedBell, setSelectedBell] = useState(1);
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState("25:00");
  const [volume] = useState(30);
  const router = useRouter();

  // Picker feedback (haptics)
  const pickerFeedback = useCallback(() => {
    try {
      Haptics.selectionAsync();
    } catch (error) {
      console.warn("Picker feedback failed:", error);
    }
  }, []);

  // Helper to encode duration for navigation
  const encodeDuration = (durationStr) => {
    // e.g. "25:00" or "01:02:03"
    return encodeURIComponent(durationStr);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5">
        <View className="my-8">
          <Text className="text-white text-lg text-center mb-8">
            Timer Settings
          </Text>
          {/* Bowl indicators */}
        </View>

        {/* Settings options */}
        <View className="mt-5">
          <TouchableOpacity
            className="flex-row justify-between items-center bg-zinc-900 px-5 py-4 rounded-full mb-2.5"
            onPress={() => setShowPicker(true)}
          >
            <Text className="text-gray-400 text-base">Duration</Text>
            <View className="flex-row items-center">
              <Text className="text-white text-base mr-2">
                Meditation {duration}
              </Text>
              <Text className="text-gray-500 text-xl">›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-between items-center bg-zinc-900 px-5 py-4 rounded-full mb-2.5"
            onPress={() =>
              router.push({
                pathname: "/Intervals",
                params: { duration, modal: "Interval bells" },
              })
            }
          >
            <Text className="text-gray-400 text-base">Interval bells</Text>
            <View className="flex-row items-center">
              <Text className="text-white text-base mr-2">None</Text>
              <Text className="text-gray-500 text-xl">›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plus Timer promotion */}
      </ScrollView>

      {/* TimerPickerModal for Duration */}
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setDuration(formatTime(pickedDuration));
          setShowPicker(false);
        }}
        modalTitle="Set Duration"
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        pickerFeedback={pickerFeedback}
        styles={{
          theme: "dark",
        }}
        modalProps={{
          overlayOpacity: 0.2,
        }}
      />

      {/* Bottom controls */}
      <View className="flex-row justify-center items-center px-5 py-5">
        <TouchableOpacity
          className="bg-white px-10 py-4 rounded-full"
          onPress={() =>
            router.push({ pathname: "/Timer", params: { duration } })
          }
        >
          <Text className="text-black text-lg font-semibold">Start</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom navigation */}
      {/* <View className="flex-row justify-around py-4 border-t border-gray-800">
        {["Home", "Library", "Timer", "Teachers", "Saved"].map(
          (item, index) => (
            <TouchableOpacity key={index} className="items-center">
              <View
                className={`w-6 h-6 rounded-full mb-1 ${
                  item === "Timer" ? "bg-white" : "bg-gray-500"
                }`}
              />
              <Text
                className={`text-xs ${
                  item === "Timer" ? "text-white" : "text-gray-500"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View> */}
    </SafeAreaView>
  );
}
