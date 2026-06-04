import React, {
  useEffect,
  useState,
} from "react";

import {
  Image
} from "react-native";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db }
from "../services/firebaseConfig";

import { TOILET_CONFIG }
from "../config/toiletConfig";

const ratings = [

  {
    label: "SANGAT BURUK",
    emoji: "😡",
  },

  {
    label: "KURANG BAIK",
    emoji: "🙁",
  },

  {
    label: "BIASA SAJA",
    emoji: "😐",
  },

  {
    label: "PUAS",
    emoji: "🙂",
  },

  {
    label: "SANGAT PUAS",
    emoji: "😄",
  },

];

const issuesList = [

  "Lantai Licin/Basah",
  "Tissue Toilet Habis",
  "Sabun Cair Kosong",
  "Bau Tidak Sedap",
  "Kran Air Mati/Kecil",
  "Tempat Sampah Penuh",
  "Lampu Redup/Mati",
  "Gantungan Baju Rusak",

];

export default function FeedbackScreen() {

  const [rating, setRating] =
    useState("");

  const [issues, setIssues] =
    useState<string[]>([]);

  const [note, setNote] =
    useState("");

  const [timeNow, setTimeNow] =
    useState("");

  const [loading, setLoading] =
  useState(false);

  const [submitted, setSubmitted] =
  useState(false);

  const [countdown, setCountdown] =
  useState(3);

  const toggleIssue = (
    issue: string
  ) => {

    if (issues.includes(issue)) {

      setIssues(
        issues.filter(
          (i) => i !== issue
        )
      );

    } else {

      setIssues([
        ...issues,
        issue,
      ]);

    }

  };

  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      const formatted =
        now.toLocaleTimeString(
          "id-ID",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ) + " WIB";

      setTimeNow(formatted);

    };

    updateClock();

    const interval =
      setInterval(
        updateClock,
        1000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const handleSubmit =
  async () => {

    try {

      setLoading(true);

      if (!rating) {

        Alert.alert(
          "Pilih Rating",
          "Silakan pilih rating terlebih dahulu."
        );

        return;

      }

      await addDoc(
        collection(
          db,
          "feedbacks"
        ),

        {
          toiletId: TOILET_CONFIG.id,

          rating,

          issues,

          note,

          createdAt:
            serverTimestamp(),
        }
      );

      // Alert.alert(
      //   "Berhasil",
      //   "Feedback berhasil dikirim."
      // );

      setRating("");
      setIssues([]);
      setNote("");

      setSubmitted(true);
      setLoading(false);

      setTimeout(() => {

        setRating("");
        setIssues([]);
        setNote("");

      }, 3000);

    } catch (err) {

      setLoading(false);

      console.log(err);

      Alert.alert(
        "Error",
        "Gagal mengirim feedback."
      );

    }

  };

useEffect(() => {

  if (submitted) {

    setCountdown(3);

    const interval = setInterval(() => {

      setCountdown((prev) => {

        if (prev <= 1) {

          clearInterval(interval);

          setSubmitted(false);

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }

}, [submitted]);

if (submitted) {

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <View style={styles.headerLeft}>

          <Image
            source={require("../../assets/logo_trakindo.png")}
            style={styles.logo}
          />

          <View>

            <Text style={styles.headerTitle}>
              Toilet Card Control Electronic
            </Text>

            <Text style={styles.headerSubtitle}>
              {TOILET_CONFIG.name}
            </Text>

          </View>

        </View>

        <View style={styles.headerRight}>

          <Text style={styles.timeLabel}>
            LIVE TIME
          </Text>

          <Text style={styles.timeText}>
            {timeNow}
          </Text>

        </View>

      </View>

      {/* SUCCESS */}
      <View style={styles.successContainer}>

        <Text style={styles.successEmoji}>
          ✅
        </Text>

        <Text style={styles.successTitle}>
          TERIMA KASIH
        </Text>

        <Text style={styles.successSubtitle}>
          Feedback Anda berhasil dikirim
        </Text>

        <Text style={styles.countdownText}>
          Kembali ke survey dalam {countdown} detik...
        </Text>

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>

        <Text style={styles.footerText}>
          TRAKINDO INTERNAL SYSTEM
        </Text>

        <Text style={styles.footerText}>
          QR Sync Active
        </Text>

      </View>

    </View>

  );

}

  return (

    <View
      style={styles.container}
    >

      {/* HEADER */}
      <View style={styles.header}>

        <View style={styles.headerLeft}>

          <Image
            source={require("../../assets/logo_trakindo.png")}
            style={styles.logo}
          />

          <View>

            <Text style={styles.headerTitle}>
              Toilet Card Control Electronic
            </Text>

            <Text style={styles.headerSubtitle}>
              {TOILET_CONFIG.name}
            </Text>

          </View>

        </View>

        <View style={styles.headerRight}>

          <Text style={styles.timeLabel}>
            LIVE TIME
          </Text>

          <Text style={styles.timeText}>
            {timeNow}
          </Text>

        </View>

      </View>

      {/* HERO */}
      <View style={styles.heroSection}>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ✨ Bantu Kami Tetap Bersih & Nyaman
          </Text>
        </View>

        <Text style={styles.title}>
          BAGAIMANA KONDISI
          TOILET KAMI HARI INI?
        </Text>

        <Text style={styles.subtitle}>
          Feedback Anda membantu kami
          meningkatkan kualitas layanan.
        </Text>

      </View>

      {/* RATING */}
      {/* CONTENT */}
      <View style={styles.contentWrapper}>

        <View style={styles.section}>

  <Text style={styles.label}>
    PILIH RATING
  </Text>

  <View style={styles.ratingContainer}>

    {ratings.map((item) => (

      <TouchableOpacity
        key={item.label}
        style={[
          styles.ratingCard,
          rating === item.label &&
          styles.ratingSelected,
        ]}
        onPress={() =>
          setRating(item.label)
        }
      >

        <Text style={styles.emoji}>
          {item.emoji}
        </Text>

        <Text style={styles.ratingText}>
          {item.label}
        </Text>

      </TouchableOpacity>

    ))}

  </View>

</View>



{/* ISSUES */}
{(
  rating === "SANGAT BURUK" ||
  rating === "KURANG BAIK"
) && (

<View style={styles.section}>

  <Text style={styles.label}>
    KELUHAN UTAMA
  </Text>

  <View style={styles.issueContainer}>

          {issuesList.map((item) => (

            <TouchableOpacity
              key={item}

              style={[

                styles.issueButton,

                issues.includes(item) &&
                styles.issueSelected,

              ]}

              onPress={() =>
                toggleIssue(item)
              }
            >

              <Text
                style={[
                  styles.issueText,
                  issues.includes(item) &&
                    styles.issueTextSelected,
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      </View>

        )}
  


      {/* BUTTON */}
      <TouchableOpacity
        disabled={!rating}
        style={[
          styles.submitButton,
          !rating && styles.submitDisabled,
        ]}
        onPress={handleSubmit}
      >

      <Text style={styles.submitText}>
        {loading
          ? "MENGIRIM..."
          : "➤ KIRIM FEEDBACK"}
      </Text>

      </TouchableOpacity>

      {/* FOOTER */}
      <View style={styles.footer}>

        <Text style={styles.footerText}>
          TRAKINDO INTERNAL SYSTEM
        </Text>

        <Text style={styles.footerText}>
          QR Sync Active
        </Text>

      </View>

      </View>
   
    </View>

  );

}

const styles = StyleSheet.create({

successContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

successEmoji: {
  fontSize: 80,
  marginBottom: 20,
},

successTitle: {
  fontSize: 42,
  fontWeight: "800",
  color: "#292524",
},

successSubtitle: {
  marginTop: 10,
  fontSize: 18,
  color: "#78716C",
},

countdownText: {
  marginTop: 20,
  fontSize: 16,
  color: "#B45309",
  fontWeight: "700",
},

successButton: {
  marginTop: 40,
  backgroundColor: "#D9F99D",
  paddingHorizontal: 40,
  paddingVertical: 16,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: "#A3E635",
},

successButtonText: {
  fontWeight: "700",
  color: "#365314",
  letterSpacing: 2,
},

headerRight: {
  alignItems: "flex-end",
},

timeLabel: {
  fontSize: 10,
  letterSpacing: 0,
  color: "#94A3B8",
},

timeText: {
  color: "#0F172A",
  fontWeight: "800",
  fontSize: 18,
},

contentWrapper: {
  width: "100%",
  maxWidth: 1320,
  alignSelf: "center",
},

logo: {
  width: 150,
  height: 42,
  resizeMode: "contain",
  marginRight: 14,
},

container: {
  flex: 1,
  backgroundColor: "#F5F5F3",
  paddingHorizontal: 32,
  paddingTop: 32,
},

header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: 1320,
  alignSelf: "center",
  paddingBottom: 18,
  marginBottom: 28,
  borderBottomWidth: 1,
  borderBottomColor: "#E7E5E4",
},

headerLeft: {
  flexDirection: "row",
  alignItems: "center",
},

brandBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F5B301",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 10,
  marginRight: 14,
},

brandText: {
  color: "#111827",
  fontWeight: "900",
  fontSize: 15,
},

catBox: {
  backgroundColor: "#111827",
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 4,
  marginLeft: 8,
},

catText: {
  color: "#F5B301",
  fontWeight: "900",
  fontSize: 10,
},

headerTitle: {
  color: "#0F172A",
  fontWeight: "800",
  fontSize: 15,
},

headerSubtitle: {
  color: "#94A3B8",
  marginTop: 2,
  letterSpacing: 0,
  fontSize: 10,
},

// headerRight: {
//   backgroundColor: "#0B1320",
//   paddingHorizontal: 16,
//   paddingVertical: 8,
//   borderRadius: 14,
// },

// timeText: {
//   color: "#FFF",
//   fontWeight: "800",
//   letterSpacing: 1,
//   fontSize: 13,
// },

heroSection: {
  alignItems: "center",
  marginBottom: 28,
  marginTop: 0,
},

badge: {
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 999,
  marginBottom: 32,
  borderWidth: 1,
  borderColor: "#E7E5E4",
},

badgeText: {
  color: "#B45309",
  fontWeight: "700",
  letterSpacing: 0,
},

title: {
  color: "#292524",
  fontSize: 48,
  fontWeight: "700",
  textAlign: "center",
  lineHeight: 48,
  marginBottom: 6,
  letterSpacing: -1,
  maxWidth: 900,
},

subtitle: {
  color: "#78716C",
  fontSize: 16,
  textAlign: "center",
  lineHeight: 20,
  maxWidth: 700,
},

section: {
  marginBottom: 18,
},

label: {
  color: "#78716C",
  fontSize: 14,
  fontWeight: "700",
  marginBottom: 10,
  letterSpacing: 0,
},

ratingContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
},

ratingCard: {
  flex: 1,
  maxWidth: 250,
  height: 130,
  backgroundColor: "#FFFFFF",
  borderRadius: 26,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#D6D3D1",
  marginHorizontal: 6,
},

ratingSelected: {
  borderColor: "#B45309",
  backgroundColor: "#FFF7ED",
  borderWidth: 2,
},

emoji: {
  fontSize: 42,
  marginBottom: 8,
},

ratingText: {
  color: "#0F172A",
  fontWeight: "800",
  textAlign: "center",
  fontSize: 14,
},

issueContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  width: "100%",
},

issueButton: {
  backgroundColor: "#FFFFFF",
  borderRadius: 999,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: "#E7E5E4",
},

issueSelected: {
  backgroundColor: "#FFF7ED",
  borderColor: "#B45309",
},

issueText: {
  color: "#44403C",
  fontWeight: "500",
  fontSize: 13,
},

issueTextSelected: {
  color: "#B45309",
  fontWeight: "700",
},

input: {
  minHeight: 90,
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 20,
  color: "#44403C",
  borderWidth: 1,
  borderColor: "#D6D3D1",
  textAlignVertical: "top",
  fontSize: 16,
},

submitButton: {
  backgroundColor: "#A3D977",
  borderColor: "#7FB14F",
  paddingVertical: 14,
  borderRadius: 18,
  marginTop: 8,
  borderWidth: 1,
},

submitDisabled: {
  opacity: 0.4,
},

submitText: {
  textAlign: "center",
  fontWeight: "700",
  fontSize: 16,
  color: "#2F4F1E",
  letterSpacing: 0,
},

footer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
  width: "100%",
},

footerText: {
  color: "#64748B",
  fontSize: 12,
  letterSpacing: 0,
},

});