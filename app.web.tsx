
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  PanResponder,
  StyleSheet,
} from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";

export default function App() {
  const [page, setPage] = useState<"checklist" | "feedback">("checklist");

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn("Fullscreen gagal:", error);
    }
  };

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
          <HomeScreen onToggleFullscreen={toggleFullscreen} />
        ) : (
          <FeedbackScreen />
        )}
      </View>
            <Pressable
        onPress={toggleFullscreen}
        style={styles.fullscreenButton}
      >
        <Text style={styles.fullscreenIcon}>FS</Text>
      </Pressable>
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
    fullscreenButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "rgba(30, 30, 30, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 10,
  },

  fullscreenIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  });

