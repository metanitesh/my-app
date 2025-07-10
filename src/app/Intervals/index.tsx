import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
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

// Helper to convert "HH:MM:SS" or "MM:SS" to total seconds for sorting
function timeStringToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
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

const IntervalBellsScreen = () => {
  const [bellEntries, setBellEntries] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  // Picker feedback (haptics)
  const pickerFeedback = useCallback(() => {
    try {
      Haptics.selectionAsync();
    } catch (error) {
      console.warn("Picker feedback failed:", error);
    }
  }, []);

  // Add bell handler
  const handleAddBell = (pickedDuration) => {
    // For demo, just add a new bell with the picked time
    const newId =
      bellEntries.length > 0
        ? Math.max(...bellEntries.map((b) => b.id)) + 1
        : 1;
    setBellEntries((prev) => {
      const newEntries = [
        ...prev,
        {
          id: newId,
          name: "Basu - Bell2",
          subtitle: "Basu • 1 strike",
          time: formatTime(pickedDuration),
        },
      ];
      // Always show bells in order of time (ascending)
      return newEntries.sort(
        (a, b) => timeStringToSeconds(a.time) - timeStringToSeconds(b.time)
      );
    });
    setShowPicker(false);
  };

  const handleDeleteBell = (id) => {
    setBellEntries((prev) => {
      const filtered = prev.filter((bell) => bell.id !== id);
      // Keep bells in order after deletion
      return filtered.sort(
        (a, b) => timeStringToSeconds(a.time) - timeStringToSeconds(b.time)
      );
    });
  };

  const BellIcon = () => (
    <View
      className="w-12 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      <View className="w-full h-full bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-full" />
    </View>
  );

  // Always show bell entries in order
  const orderedBellEntries = [...bellEntries].sort(
    (a, b) => timeStringToSeconds(a.time) - timeStringToSeconds(b.time)
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* <StatusBar barStyle="light-content" backgroundColor="#000" /> */}

      {/* Header */}

      {/* Add Bell Section */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-gray-900 border-b border-gray-800">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          {/* Plus: Feather "plus" */}
          <Feather name="plus" size={16} color="#666" />
          <Text className="text-gray-400 text-base ml-2">Add bell</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          {/* MoreHorizontal: Feather "more-horizontal" */}
          <Feather name="more-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Bell Entries */}
      <View className="flex-1 bg-gray-800 px-4 pt-8">
        {orderedBellEntries.map((bell, index) => (
          <View
            key={bell.id}
            className={`flex-row items-center justify-between py-6 ${
              index < orderedBellEntries.length - 1
                ? "border-b border-gray-700"
                : ""
            }`}
          >
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                onPress={() => handleDeleteBell(bell.id)}
                style={{ marginRight: 12 }}
                accessibilityLabel="Delete bell"
                hitSlop={10}
              >
                <Feather name="trash-2" size={22} color="#ef4444" />
              </TouchableOpacity>
              <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-medium">
                  Default Bell
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {bell.subtitle}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 text-base">{bell.time}</Text>
          </View>
        ))}
      </View>

      {/* TimerPickerModal for Add Bell */}
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={handleAddBell}
        modalTitle="Set Bell Time"
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

      {/* Bottom Navigation */}
    </SafeAreaView>
  );
};

export default IntervalBellsScreen;
