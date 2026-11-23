
import React, { useState, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";

export default function App() {
  const [page, setPage] = useState<"checklist" | "feedback">("checklist");

  const pageRef = useRef(page);
  pageRef.current = page;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return (
            Math.abs(gesture.dx) > 20 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy)
          );
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -60 && pageRef.current === "checklist") {
            setPage("feedback");
          } else if (
            gesture.dx > 60 &&
            pageRef.current === "feedback"
          ) {
            setPage("checklist");
          }
        },
      }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.content} {...panResponder.panHandlers}>
        {page === "checklist" ? (
          <HomeScreen />
        ) : (
          <FeedbackScreen />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
