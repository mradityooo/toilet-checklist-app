import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

type Props = {
  dateNow: string;
  time: string;
  selectedMonth: number;
  setSelectedMonth: (value: number) => void;
  selectedYear: number;
  setSelectedYear: (value: number) => void;
  exportPDF: () => void;
};

export default function ModernHeader({
  dateNow,
  time,
  exportPDF,
}: Props) {
  return (
    <View style={styles.headerWrapper}>

      {/* LEFT */}
      <View style={styles.brandSection}>

        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/logo_trakindo.png")}
            style={styles.logo}
          />
        </View>

        <View>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>
              Trakindo
            </Text>

            <View style={styles.catBadge}>
              <Text style={styles.catText}>
                CAT
              </Text>
            </View>
          </View>

          <Text style={styles.brandSubtitle}>
            FACILITY MANAGEMENT
          </Text>
        </View>

      </View>

      {/* CENTER */}
      <View style={styles.controlCenter}>

        <Text style={styles.dateText}>
          {dateNow}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.timeText}>
          {time}
        </Text>

      </View>

      {/* RIGHT */}
      <TouchableOpacity
        style={styles.exportButton}
        onPress={exportPDF}
      >
        <Text style={styles.exportText}>
          EXPORT
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 14,

    paddingHorizontal: 18,
    paddingVertical: 14,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  brandSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 52,
    height: 52,

    borderRadius: 14,

    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  logo: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  catBadge: {
    marginLeft: 8,

    backgroundColor: "#FFC72C",

    paddingHorizontal: 7,
    paddingVertical: 2,

    borderRadius: 6,
  },

  catText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#111827",
  },

  brandSubtitle: {
    marginTop: 3,

    fontSize: 10,
    letterSpacing: 2,

    color: "#64748B",
    fontWeight: "600",
  },

  controlCenter: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 16,
  },

  divider: {
    width: 1,
    height: 20,

    backgroundColor: "#CBD5E1",

    marginHorizontal: 14,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  timeText: {
    fontSize: 15,
    fontWeight: "700",

    color: "#64748B",

    letterSpacing: 2,
  },

  exportButton: {
    backgroundColor: "#0F172A",

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 16,
  },

  exportText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});