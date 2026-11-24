import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ModernHeader from "../components/ModernHeader";

import {
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../services/firebaseConfig";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import logoBase64 from "../utils/logoBase64";

import { TOILET_CONFIG }
from "../config/toiletConfig";


import { Picker } from "@react-native-picker/picker";

const fields = [
  "Lantai",
  "Closet",
  "Wastafel",
  "Sabun",
  "Tissue",
];

  // const CELL_WIDTH = 123;
  const DAY_WIDTH = 70;
  const INSPECTOR_WIDTH = 93;
  const ROW_HEIGHT = 30;
  const NAVY: [number, number, number] = [0, 32, 96];
  const GOLD: [number, number, number] = [255, 193, 7];
  
  type Props = {
    onToggleFullscreen: () => void;
  };

  export default function HomeScreen({ onToggleFullscreen }: Props) {

  const [time, setTime] = useState("");
  const [dateNow, setDateNow] = useState("");
  const [data, setData] = useState<any>({});
  const [locked, setLocked] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    
    
  new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const currentDay = new Date().getDate();

const updateInspector = async (
  day: number,
  session: "pagi" | "sore",
  value: string
) => {

  try {

    const docId =
`${selectedYear}-${selectedMonth}-1`;

    await setDoc(
     doc(
        db,
        "checklists",
        TOILET_CONFIG.id,
        "months",
        docId
      ),
      {
        inspectors: {
          [day]: {
            [session]: value,
          },
        },
      },
      { merge: true }
    );

  } catch (error) {
    console.log(error);
  }
};

  const isSessionLocked = (
  day: number,
  session: "pagi" | "sore"
) => {

  const now = new Date();

  const currentDay = now.getDate();

  const currentTime =
    now.getHours() +
    now.getMinutes() / 60;

  // hari selain hari ini = lock
  if (day !== currentDay) {
    return true;
  }

  // PAGI
  if (session === "pagi") {

    // buka jam 7 - 9
    return !(
      currentTime >= 7 &&
      currentTime < 9
    );
  }

  // SORE
  if (session === "sore") {

    // buka jam 15 - 16
    return !(
      currentTime >= 15 &&
      currentTime < 16
    );
  }

  return true;
};

  const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
  ];

 useEffect(() => {

  const docId =
`${selectedYear}-${selectedMonth}-1`;

  const unsubscribe = onSnapshot(
    doc(
      db,
      "checklists",
      TOILET_CONFIG.id,
      "months",
      docId
    ),
    (snapshot) => {

      if (snapshot.exists()) {

        const firestoreData =
          snapshot.data();

        setData(firestoreData);

        setLocked(
          firestoreData?.locked || false
        );

      } else {

  const emptyData: any = {};

  for (let day = 1; day <= 31; day++) {

    emptyData[day] = {};

    fields.forEach((field) => {

      emptyData[day][field] = {
        pagi: false,
        sore: false,
      };
    });
  }

  setData(emptyData);

  setLocked(false);
}
    }
  );

  return () => unsubscribe();

}, [
  selectedMonth,
  selectedYear,
]);


 useEffect(() => {

  const updateClock = () => {

    const now = new Date();


    setDateNow(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    setTime(
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  updateClock();

  const interval =
    setInterval(updateClock, 1000);

  return () =>
    clearInterval(interval);

}, []);

  const handleCheck = async (
  day: number,
  field: string,
  session: string
) => {
  try {
    const docId =
`${selectedYear}-${selectedMonth}-1`;

    const currentValue =
      data?.[day]?.[field]?.[session] || false;

    const newValue = !currentValue;

    await setDoc(
     doc(
        db,
        "checklists",
        TOILET_CONFIG.id,
        "months",
        docId
      ),
      {
        [day]: {
          [field]: {
            [session]: newValue,
          },
        },
      },
      { merge: true }
    );

    setData((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: {
          ...prev[day]?.[field],
          [session]: newValue,
        },
      },
    }));
  } catch (error) {
    console.log(error);
  }
};

  const totalDays = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    console.log(totalDays);

    const now = new Date();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime =
      currentHour + currentMinute / 60;

    // PAGI
    const pagiUnlocked =
      currentTime >= 7 &&
      currentTime < 9;

    // SORE
    const soreUnlocked =
      currentTime >= 15 &&
      currentTime < 16;

    let issueCount = 0;

    for (let day = 1; day <= totalDays; day++) {

      fields.forEach((field) => {

        const pagi =
          data?.[day]?.[field]?.pagi;

        const sore =
          data?.[day]?.[field]?.sore;

        if (!pagi) issueCount++;

        if (!sore) issueCount++;
      });
    }

  const renderCheck = (
  day: number,
  field: string,
  session: "pagi" | "sore"
) => {

  const checked =
    data?.[day]?.[field]?.[session];

  return (

    <TouchableOpacity
      activeOpacity={1}
      disabled={isSessionLocked(day, session)}
      style={[
        styles.checkCell,
        {
          opacity:
          isSessionLocked(day, session)
            ? 0.4
            : 1,
        },
      ]}
      onPress={() => {

        if (
          !locked &&
          !isSessionLocked(day, session)
        ) {

          if (
            (session === "pagi" &&
              pagiUnlocked) ||

            (session === "sore" &&
              soreUnlocked)
          ) {

            handleCheck(
              day,
              field,
              session
            );
          }
        }
      }}
    >

      <CheckCircle
        active={checked}
       disabled={isSessionLocked(day, session)}
      />

    </TouchableOpacity>

  );
};



  const totalChecks =
  totalDays * fields.length * 2;

let checkedCount = 0;

for (let day = 1; day <= totalDays; day++) {
  fields.forEach((field) => {
    if (data?.[day]?.[field]?.pagi)
      checkedCount++;

    if (data?.[day]?.[field]?.sore)
      checkedCount++;
  });
}

const completionRate = Math.round(
  (checkedCount / totalChecks) * 100
);

const checklistArray = Array.from(
  { length: totalDays },
  (_, i) => {

    const day = i + 1;

    return {
      day,

      lantai: {
        pagi:
          data?.[day]?.Lantai?.pagi || false,
        sore:
          data?.[day]?.Lantai?.sore || false,
      },

      closet: {
        pagi:
          data?.[day]?.Closet?.pagi || false,
        sore:
          data?.[day]?.Closet?.sore || false,
      },

      wastafel: {
        pagi:
          data?.[day]?.Wastafel?.pagi || false,
        sore:
          data?.[day]?.Wastafel?.sore || false,
      },

      sabun: {
        pagi:
          data?.[day]?.Sabun?.pagi || false,
        sore:
          data?.[day]?.Sabun?.sore || false,
      },

      tissue: {
        pagi:
          data?.[day]?.Tissue?.pagi || false,
        sore:
          data?.[day]?.Tissue?.sore || false,
      },

      pemeriksa: {
        pagi:
          data?.inspectors?.[day]?.pagi || "",
        sore:
          data?.inspectors?.[day]?.sore || "",
      },
    };
  }
);

const exportMonthlyPDF = () => {
  // Membuat dokumen bentuk portrait A4
  const docPDF = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageHeight = docPDF.internal.pageSize.height; // 297 mm
  const pageWidth = docPDF.internal.pageSize.width; // 210 mm

// ==========================================
// 1. LOGO TRAKINDO
// ==========================================

docPDF.addImage(
  logoBase64,
  "PNG",
  14,
  10,
  34,
  14
);

  // ==========================================
  // 2. KOTAK PENULISAN NOMOR ("NO") SEBELAH KANAN
  // ==========================================
  docPDF.setDrawColor(0, 0, 0);
  docPDF.setLineWidth(0.35);
  docPDF.rect(148, 12, 48, 8, "D");
  docPDF.line(158, 12, 158, 20); // Garis pemisah kecil di dalam kotak

  docPDF.setTextColor(0, 0, 0);
  docPDF.setFont("helvetica", "bold");
  docPDF.setFontSize(8.5);
  docPDF.text("NO", 151, 17.4);

  // ==========================================
  // 3. JUDUL UTAMA DENGAN DUA BAHASA (BILINGUAL)
  // ==========================================
  docPDF.setTextColor(0, 0, 0);
  docPDF.setFont("helvetica", "bold");
  docPDF.setFontSize(13);
  docPDF.text("Kartu Kontrol Toilet", 108, 28, { align: "center" });

  docPDF.setFont("helvetica", "normal");
  docPDF.setFontSize(10.5);
  docPDF.text("Toilet Control Card", 108, 33, { align: "center" });

  // ==========================================
  // 4. INFORMASI BULAN & LOKASI TOILET
  // ==========================================
  // Konversi nama bulan ke dalam format Bahasa Inggris di dokumen cetak
  const monthUpper =
  months[selectedMonth].toUpperCase();
  let monthLabel = monthUpper;
  if (monthUpper === "MEI") monthLabel = "MAY";
  else if (monthUpper === "DESEMBER") monthLabel = "DECEMBER";
  else if (monthUpper === "AGUSTUS") monthLabel = "AUGUST";
  else if (monthUpper === "OKTOBER") monthLabel = "OCTOBER";
  else if (monthUpper === "JANUARI") monthLabel = "JANUARY";
  else if (monthUpper === "FEBRUARI") monthLabel = "FEBRUARY";
  else if (monthUpper === "MARET") monthLabel = "MARCH";
  else if (monthUpper === "JUNI") monthLabel = "JUNE";
  else if (monthUpper === "JULI") monthLabel = "JULY";

  docPDF.setFont("helvetica", "bold");
  docPDF.setFontSize(9.5);
  docPDF.setTextColor(0, 0, 0);
  docPDF.text(`Bulan : ${monthLabel} ${selectedYear}`, 14, 39);
  
  // Informasi Lokasi Toilet di sisi kanan (paling sering Toilet Pria LT 4)
docPDF.text(
  TOILET_CONFIG.name,
  170,
  39
);

  // ==========================================
  // 5. PENYUSUNAN STRUKTUR KOLOM DOUBLE-HEADER
  // ==========================================
const tableHeaders = [
  [
    {
      content: "TGL",
      rowSpan: 2,
      styles: {
        halign: "center" as const,
        valign: "middle" as const,
        fontStyle: "bold" as const
      }
    },

    { content: "Lantai", colSpan: 2 },
    { content: "Closet", colSpan: 2 },
    { content: "Wastafel", colSpan: 2 },
    { content: "Sabun Cair", colSpan: 2 },
    { content: "Toilet Paper/Dryer", colSpan: 2 },
    { content: "Pemeriksa", colSpan: 2 }
  ],

  [
    "Pagi", "Sore",
    "Pagi", "Sore",
    "Pagi", "Sore",
    "Pagi", "Sore",
    "Pagi", "Sore",
    "Pagi", "Sore"
  ]
];

  // Map data lokal menjadi baris-baris isian pada tabel
  const tableRows = Array.from(
  { length: totalDays },
  (_, i) => {

    const day = i + 1;

    return [

      day.toString(),

      data?.[day]?.Lantai?.pagi
        ? "✓"
        : "",

      data?.[day]?.Lantai?.sore
        ? "✓"
        : "",

      data?.[day]?.Closet?.pagi
        ? "✓"
        : "",

      data?.[day]?.Closet?.sore
        ? "✓"
        : "",

      data?.[day]?.Wastafel?.pagi
        ? "✓"
        : "",

      data?.[day]?.Wastafel?.sore
        ? "✓"
        : "",

      data?.[day]?.Sabun?.pagi
        ? "✓"
        : "",

      data?.[day]?.Sabun?.sore
        ? "✓"
        : "",

      data?.[day]?.Tissue?.pagi
        ? "✓"
        : "",

      data?.[day]?.Tissue?.sore
        ? "✓"
        : "",

      data?.inspectors?.[day]
        ?.pagi || "",

      data?.inspectors?.[day]
        ?.sore || "",
    ];
  }
);

  // ==========================================
  // 6. RENDER TABEL UTAMA MENGGUNAKAN AUTOTABLE
  // ==========================================
  const tableWidth =
  8 +                    // TGL
  (14.5 * 10) +          // checklist
  (18 * 2);              // pemeriksa

const startX =
  (pageWidth - tableWidth) / 2;

  autoTable(docPDF, {
    startY: 43,
    margin: {
      left: startX,
    },
    head: tableHeaders,
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 6.8,
      halign: "center",
      valign: "middle",
      lineColor: [0, 0, 0], // Garis kisi hitam solid
      lineWidth: 0.2,       // Ketebalan garis minimal agar terlihat rapi
      cellPadding: 0.8,
      textColor: [0, 0, 0]
    },
    headStyles: {
      fillColor: [255, 255, 255], // Putih polos agar sesuai kartu cetakan pabrik
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 7,
      lineColor: [0, 0, 0],
      lineWidth: 0.25
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255] // Mematikan selang-seling abu-abu (flat white)
    },
  columnStyles: {

    // TGL
    0: { cellWidth: 8 },

    // LANTAI
    1: { cellWidth: 14.5 },
    2: { cellWidth: 14.5 },

    // CLOSET
    3: { cellWidth: 14.5 },
    4: { cellWidth: 14.5 },

    // WASTAFEL
    5: { cellWidth: 14.5 },
    6: { cellWidth: 14.5 },

    // SABUN
    7: { cellWidth: 14.5 },
    8: { cellWidth: 14.5 },

    // TISSUE
    9: { cellWidth: 14.5 },
    10:{ cellWidth: 14.5 },

    // PEMERIKSA
    11:{ cellWidth: 18 },
    12:{ cellWidth: 18 },
  },
    didParseCell: (data) => {
      // Mengubah warna tanda centang (✓) menjadi warna biru pulpen asli (Royal Blue)
      if (data.section === "body" && data.column.index >= 1 && data.column.index <= 10) {
        if (data.cell.text[0] === "✓") {
          data.cell.styles.textColor = [30, 58, 138]; 
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fontSize = 7.5;
        }
      }
    }
  });

  // ==========================================
  // 7. CATATAN KETERANGAN (LEGENDA DI BAWAH TABEL)
  // ==========================================
  const finalTableY = (docPDF as any).lastAutoTable.finalY;
  const notesY = finalTableY + 5;

  docPDF.setFont("helvetica", "bold");
  docPDF.setFontSize(7);
  docPDF.setTextColor(0, 0, 0);
  
  // Teks Baris OK
  docPDF.text("OK/ ", 14, notesY);
  const okWidth = docPDF.getTextWidth("OK/ ");
  
  // Tanda Centang Biru OK di keterangan
  docPDF.setFont("helvetica", "bold");
  docPDF.setTextColor(30, 58, 138); // Biru Pena
  docPDF.text("✓", 14 + okWidth, notesY);
  
  docPDF.setFont("helvetica", "normal");
  docPDF.setTextColor(0, 0, 0);
  docPDF.text(" = Bersih, kering, berfungsi baik (dryer), terisi minimal setengah (sabun cair), air bersih mengalir lancar", 14 + okWidth + 2.5, notesY);

  // Teks Baris NOK
  docPDF.setFont("helvetica", "bold");
  docPDF.text("NOK/ ", 14, notesY + 3.8);
  const nokWidth = docPDF.getTextWidth("NOK/ ");
  
  // Tanda Silang Merah NOK di keterangan
  docPDF.setFont("helvetica", "bold");
  docPDF.setTextColor(220, 38, 38); // Merah Tegas
  docPDF.text("X", 14 + nokWidth, notesY + 3.8);
  
  docPDF.setFont("helvetica", "normal");
  docPDF.setTextColor(0, 0, 0);
  docPDF.text(" = Tidak bersih, basah, tidak berfungsi (dryer), terisi kurang dari setengah (sabun cair), air tidak lancar/tidak bersih", 14 + nokWidth + 2.5, notesY + 3.8);

  // ==========================================
  // 8. FOOTER METADATA RESMI PERUSAHAAN (SOP & FORM)
  // ==========================================
  docPDF.setFont("helvetica", "bold");
  docPDF.setFontSize(7.5);
  docPDF.setTextColor(100, 116, 139); // Warna Slate-400 netral
  docPDF.text("Bagian dari / Part of - SHE.SHE.SOP.010.R01", 14, notesY + 11);
  docPDF.text("Form Number : HCM.OFO.FRM.038.R00", 196, notesY + 11, { align: "right" });

  // Unduh dokumen
  docPDF.save(`Checklist-${months[selectedMonth]}-${selectedYear}.pdf`);
};


  return (

<ScrollView
  style={styles.container}
  contentContainerStyle={{
    paddingBottom: 50,
  }}
>

  <View style={styles.dashboard}>

  {/* TOP BAR */}
  <View style={styles.topBar}>

    <View style={styles.brandSection}>

      <Image
        source={require("../../assets/logo_trakindo.png")}
        style={styles.logo}
      />

      <View>

        <Text style={styles.brandTitle}>
          Toilet Control Card Electronic
        </Text>

        <Text style={styles.brandSubtitle}>
          {TOILET_CONFIG.name}
        </Text>

      </View>

    </View>

    <View style={styles.controlCenter}>

  <View style={styles.liveDate}>

    <Text style={styles.dateText}>
      {dateNow}
    </Text>

    <View style={styles.timeDivider} />

    <Text style={styles.timeText}>
      {time}
    </Text>

  </View>

  <Picker
    selectedValue={selectedMonth}
    onValueChange={(value) =>
      setSelectedMonth(value)
    }
    style={styles.periodPicker}
  >
    {months.map((month, index) => (
      <Picker.Item
        key={index}
        label={month}
        value={index}
      />
    ))}
  </Picker>

  <Picker
    selectedValue={selectedYear}
    onValueChange={(value) =>
      setSelectedYear(value)
    }
    style={styles.yearPicker}
  >
    <Picker.Item label="2025" value={2025} />
    <Picker.Item label="2026" value={2026} />
    <Picker.Item label="2027" value={2027} />
  </Picker>

</View>

<View style={styles.headerActions}>

  <TouchableOpacity
    style={styles.fullscreenButton}
    onPress={onToggleFullscreen}
  >
    <Text style={styles.fullscreenText}>⛶</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.exportButton}
    onPress={exportMonthlyPDF}
  >
    <Text style={styles.exportButtonText}>
      EXPORT
    </Text>
  </TouchableOpacity>

</View>

  </View>


  {/* SUMMARY */}
</View>

<View style={styles.tableWrapper}>

  <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 40,
  }}
>

    <View style={styles.fullTable}>

      {/* HEADER */}
      <View style={styles.headerRow}>

  <View style={styles.dayHeader}>
    <Text style={styles.headerText}>
      TGL
    </Text>
  </View>

  {fields.map((field) => (

    <View
      key={field}
      style={styles.fieldHeader}
    >

      <Text style={styles.headerText}>
        {field.toUpperCase()}
      </Text>

      <View style={styles.subHeader}>

        <View style={styles.subCell}>
          <Text style={styles.subText}>
            PAGI
          </Text>
        </View>

        <View style={styles.subCell}>
          <Text style={styles.subText}>
            SORE
          </Text>
        </View>

      </View>

    </View>

  ))}

 

  <View style={styles.inspectorHeader}>

  <Text style={styles.headerText}>
    PEMERIKSA
  </Text>

  <View style={styles.subHeader}>

    <View style={styles.subCell}>
      <Text style={styles.subText}>
        PAGI
      </Text>
    </View>

    <View style={styles.subCell}>
      <Text style={styles.subText}>
        SORE
      </Text>
    </View>

  </View>

</View>

</View>

      {/* BODY */}
      {Array.from({
        length: totalDays,
      }, (_, i) => {

        const day = i + 1;

        return (

          <View
            key={day}
            style={styles.bodyRow}
          >

            <View style={styles.dayCell}>
              <Text style={styles.dayText}>
                {day}
              </Text>
            </View>

            {fields.map((field) => (

              <View
  key={field}
  style={styles.fieldRow}
>

  <TouchableOpacity
    style={styles.checkCell}
    activeOpacity={0.8}
    disabled={isSessionLocked(day, "pagi")}
    onPress={() =>
      handleCheck(day, field, "pagi")
    }
  >
    <CheckCircle
      active={
        data?.[day]?.[field]?.pagi
      }
      disabled={isSessionLocked(day, "pagi")}
    />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.checkCell}
    activeOpacity={0.8}
    disabled={isSessionLocked(day, "sore")}
    onPress={() =>
      handleCheck(day, field, "sore")
    }
  >
    <CheckCircle
      active={
        data?.[day]?.[field]?.sore
      }
      disabled={isSessionLocked(day, "sore")}
    />
  </TouchableOpacity>

</View>

            ))}

            <View style={styles.inspectorRow}>

  <View style={styles.inspectorCell}>
    <Picker
    enabled={!isSessionLocked(day, "pagi")}
      selectedValue={
        data?.inspectors?.[day]?.pagi || ""
      }
      onValueChange={(value) =>
        updateInspector(day, "pagi", value)
      }
      style={styles.picker}
    >
      <Picker.Item label="-" value="" />
      <Picker.Item label="RONI" value="RONI" />
      <Picker.Item label="ANDI" value="ANDI" />
      <Picker.Item label="BUDI" value="BUDI" />
    </Picker>
  </View>

  <View style={styles.inspectorCell}>
    <Picker
    enabled={!isSessionLocked(day, "sore")}
      selectedValue={
        data?.inspectors?.[day]?.sore || ""
      }
      onValueChange={(value) =>
        updateInspector(day, "sore", value)
      }
      style={styles.picker}
    >
      <Picker.Item label="-" value="" />
      <Picker.Item label="RONI" value="RONI" />
      <Picker.Item label="ANDI" value="ANDI" />
      <Picker.Item label="BUDI" value="BUDI" />
    </Picker>
  </View>

</View>

          </View>

        );
      })}

    </View>

  </ScrollView>

</View>

<View style={styles.legendContainer}>

  <Text style={styles.legendText}>
    <Text style={styles.legendOk}>✓ OK</Text>
    {" "}=
    {" "}Bersih, kering, berfungsi baik (dryer),
    terisi minimal setengah (sabun cair),
    air bersih mengalir lancar
  </Text>

  <Text style={styles.legendText}>
    <Text style={styles.legendNotOk}>○ NOK</Text>
    {" "}=
    {" "}Tidak bersih, basah,
    tidak berfungsi (dryer),
    terisi kurang dari setengah (sabun cair),
    air tidak lancar/tidak bersih
  </Text>

</View>

</ScrollView>


);
}

const CheckCircle = ({
  active,
  disabled,
}: {
  active?: boolean;
  disabled?: boolean;
}) => (
  <View
    style={[
      styles.checkCircle,
      active
        ? styles.checkCircleActive
        : disabled
        ? styles.checkCircleDisabled
        : styles.checkCircleInactive,
    ]}
  >
    <Text
      style={[
        styles.checkIcon,
        {
          color: active ? "#ffffff" : "#cbd5e1",
        },
      ]}
    >
      {active ? "✓" : ""}
    </Text>
  </View>
);

const styles = StyleSheet.create({
legendContainer: {
  width: "98%",
  alignSelf: "center",

  paddingHorizontal: 8,
  paddingVertical: 10,

  marginTop: 2,
},

legendText: {
  fontSize: 12,
  color: "#111827",
  marginBottom: 4,
  lineHeight: 18,
},

legendOk: {
  color: "#10b981",
  fontWeight: "700",
},

legendNotOk: {
  color: "#94a3b8",
  fontWeight: "700",
},

  dashboard: {
  width: "98%",
  alignSelf: "center",

  marginBottom: 8,
  marginTop: 8,
  },

  controlCenter: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 2,
  paddingHorizontal: 10,
  paddingVertical: 8,
},

  liveDate: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 2,
  paddingHorizontal: 14,
  height: 42,
},

timeDivider: {
  width: 1,
  height: 18,

  backgroundColor: "#cbd5e1",

  marginHorizontal: 12,
},

 completionValue: {
  fontSize: 32,
  fontWeight: "800",
  color: "#16a34a",
  marginTop: 2,
},

progressBar: {
  height: 10,
  backgroundColor: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
  marginTop: 18,
},

progressFill: {
  height: "100%",
  backgroundColor: "#22c55e",
  borderRadius: 999,
},

// periodRow: {
//   flexDirection: "row",
//   alignItems: "center",
//   marginTop: 10,
// },

periodPicker: {
  width: 140,
  height: 42,
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 2,
  paddingLeft: 10,
  color: "#0f172a",
},

yearPicker: {
  width: 90,
  height: 42,
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 2,
  paddingLeft: 10,
  color: "#0f172a",
},

inspectorRow: {
  flex: 1,
  flexDirection: "row",
},

inspectorCell: {
  flex: 1,
  height: 62,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderColor: "#e2e8f0",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  paddingHorizontal: 8,
},

picker: {
  width: "100%",
  height: 42,
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 2,
  color: "#0f172a",
  fontSize: 13,
  fontWeight: "600",
  paddingHorizontal: 8,
},

header: {
  backgroundColor: "#ffffff",
  borderRadius: 24,

  paddingVertical: 18,
  paddingHorizontal: 26,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.03,
  shadowRadius: 10,
  elevation: 2,
},

headerRow: {
  flexDirection: "row",
  backgroundColor: "#07142b",
  borderBottomWidth: 1,
  borderColor: "#1e293b",
},

dayHeader: {
  width: 70,
  height: 70,
  justifyContent: "center",
  alignItems: "center",
  borderRightWidth: 1,
  borderColor: "#1e293b",
},

fieldHeader: {
  width: 140,
  borderRightWidth: 1,
  borderColor: "#1e293b",
  flex: 1,
},

subHeader: {
  flexDirection: "row",
  marginTop: 10,
},

subCell: {
  flex: 1,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderColor: "#1e293b",
},

headerText: {
  color: "#ffffff",
  fontWeight: "700",
  fontSize: 13,
  textAlign: "center",
  marginTop: 10,
},

subText: {
  color: "#ffffff",
  fontSize: 11,
  fontWeight: "700",
},

checkCircle: {
  width: 28,
  height: 28,
  borderRadius: 999,
  justifyContent: "center",
  alignItems: "center",
},

checkCircleActive: {
  backgroundColor: "#10b981",
},

checkCircleInactive: {
  backgroundColor: "#ffffff",
  borderWidth: 2,
  borderColor: "#e2e8f0",
},

checkCircleDisabled: {
  backgroundColor: "#f1f5f9",
},

checkIcon: {
  fontSize: 14,
  fontWeight: "bold",
},

topBar: {
  flexDirection: "row",
  minHeight: 72,
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#ffffff",
  
  borderRadius: 2,

  paddingHorizontal: 20,
  paddingVertical: 12,

  marginBottom: 8,

  borderWidth: 1,
  borderColor: "#edf2f7",
},

brandSection: {
  overflow: "hidden",
  flexDirection: "row",
  alignItems: "center",
  height: 48,
},

logo: {
  width: 135,
  height: 61,
  resizeMode: "contain",
  marginRight: 16,
},

brandTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#0f172a",
},

brandSubtitle: {
  fontSize: 11,
  color: "#64748b",
  letterSpacing: 0,
  marginTop: 0,
},

dateSection: {
  alignItems: "center",
},

dateText: {
  fontSize: 14,
  fontWeight: "700",
  color: "#0f172a",
},

timeText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#64748b",
},

exportButton: {
  backgroundColor: "#0b1730",
  paddingHorizontal: 20,
  height: 44,
  borderRadius: 2,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
},

exportButtonText: {
  color: "#ffffff",
  fontWeight: "700",
  fontSize: 14,
},

summaryCard: {
  flex: 1,
  backgroundColor: "#ffffff",
  borderRadius: 24,

  paddingVertical: 18,
  paddingHorizontal: 22,

  minHeight: 130,

  shadowColor: "#000",
  shadowOpacity: 0.03,
  shadowRadius: 10,
  elevation: 2,

  borderWidth: 1,
  borderColor: "#edf0f5",
},

headerActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

fullscreenButton: {
  width: 36,
  height: 36,
  borderRadius: 6,
  backgroundColor: "#E2E8F0",
  justifyContent: "center",
  alignItems: "center",
},

fullscreenText: {
  color: "#0F172A",
  fontSize: 22,
  fontWeight: "bold",
},

summaryRow: {
  flexDirection: "row",
  gap: 16,
  marginTop: 18,
  marginBottom: 18,
},

card: {
  flex: 1,

  backgroundColor: "#ffffff",

  borderRadius: 22,

  paddingHorizontal: 28,
  paddingVertical: 26,

  borderWidth: 1,
  borderColor: "#edf2f7",
},

issueCard: {
  flex: 1,
  backgroundColor: "#ffffff",
  borderRadius: 28,
  padding: 26,

  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 2,

  borderWidth: 1,
  borderColor: "#edf0f5",
},

cardLabel: {
  fontSize: 13,
  fontWeight: "700",
  color: "#64748b",
  letterSpacing: 0.5,
  marginBottom: 10,
},

cardValue: {
  fontSize: 24,
  fontWeight: "800",
  color: "#0f172a",
  lineHeight: 30,
},

issueCardValue: {
  fontSize: 20,
  fontWeight: "800",
  color: "#dc2626",
},

  issueContainer: {
  paddingHorizontal: 20,
  paddingVertical: 12,
  },

  mainContainer: {
  flex: 1,
  padding: 18,
},

  issueText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "700",
  },

  container: {
  flex: 1,
  backgroundColor: "#f3f4f6",
  paddingVertical: 20,
  },

  monthPicker: {
  width: 120,
  height: 38,
  fontSize: 14,
  backgroundColor: "#fff",
  },

  fullTable: {
  width: "100%",
  
},

  topHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
  flexDirection: "row",
  alignItems: "center",
  },

  headerRight: {
    alignItems: "flex-end",
  },

  toiletTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: "#111827",
  letterSpacing: 0.5,
  },

  sessionText: {
  fontSize: 14,
  marginTop: 6,
  color: "#374151",
  },

  filterBar: {
    backgroundColor: "#dfe7f2",
    paddingHorizontal: 25,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filterLeft: {
  flexDirection: "row",
  alignItems: "center",
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
  },

  selectBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    height: 40,
    justifyContent: "center",
  },

  exportText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
  },

 tableWrapper: {
  width: "98%",
  alignSelf: "center",
  marginTop: 0,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#e2e8f0",
},

 bodyRow: {
  flexDirection: "row",
  minHeight: 62,
  backgroundColor: "#ffffff",
},

evenRow: {
  backgroundColor: "#f8fafc",
},

dayCell: {
  width: 70,
  height: 62,
  justifyContent: "center",
  alignItems: "center",
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderColor: "#e2e8f0",
},

dayText: {
  fontSize: 18,
  fontWeight: "700",
  color: "#94a3b8",
},

fieldRow: {
  width: 140,
  flexDirection: "row",
  flex: 1,
},

checkCell: {
  flex: 1,
  width: 70,
  height: 62,
  justifyContent: "center",
  alignItems: "center",
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderColor: "#e2e8f0",
},

  inspectorHeader: {
  flex: 1,
  borderRightWidth: 1,
  borderColor: "#1e293b",
  backgroundColor: "#07142b",
  },

  inspectorText: {
  width: INSPECTOR_WIDTH,
  textAlign: "center",
  fontSize: 13,
  lineHeight: ROW_HEIGHT,
  borderRightWidth: 1,
  borderColor: "#c5ccd6",
  },
});
