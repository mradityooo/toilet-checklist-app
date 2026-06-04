import React from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";

import HomeScreen from "./src/screens/HomeScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";

export default function App() {
  return (
    <PagerView
      style={{ flex: 1 }}
      initialPage={0}
    >
      <View key="1">
        <HomeScreen />
      </View>

      <View key="2">
        <FeedbackScreen />
      </View>
    </PagerView>
  );
}