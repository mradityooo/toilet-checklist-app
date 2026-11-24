const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");

const ITEMS = ["Lantai", "Closet", "Wastafel", "Sabun", "Tissue"];

const getJakartaDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const value = {};
  for (const part of parts) {
    value[part.type] = part.value;
  }

  return {
    year: Number(value.year),
    month: Number(value.month) - 1,
    day: Number(value.day),
  };
};

const getNumbers = (envName) =>
  (process.env[envName] || "")
    .split(",")
    .map((number) => number.trim())
    .filter(Boolean);


function initializeFirebase() {
  const serviceAccount = require("../backend/firebase-service-account.json");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return getFirestore();
}

async function getDailyStatus(db, floor, date) {
  const monthId = `${date.year}-${date.month}-1`;

  const snapshot = await db
    .collection("checklists")
    .doc(floor)
    .collection("months")
    .doc(monthId)
    .get();

  const dayData = snapshot.exists
    ? snapshot.data()?.[String(date.day)] || {}
    : {};

  const sessions = {};

  for (const session of ["pagi", "sore"]) {
    sessions[session] = ITEMS.filter(
      (item) => dayData?.[item]?.[session] !== true
    );
  }

  return sessions;
}

async function sendWhatsApp(target, message) {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    throw new Error("FONNTE_TOKEN belum tersedia.");
  }

  await axios.post(
    "https://api.fonnte.com/send",
    { target, message },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  console.log(`Pesan berhasil dimasukkan ke antrean: ${target}`);
}

async function sendToNumbers(numbers, message) {
  if (!numbers.length) {
    throw new Error("Daftar nomor penerima belum dikonfigurasi.");
  }

  for (const number of numbers) {
    await sendWhatsApp(number, message);
  }
}

async function run(mode) {
  const date = getJakartaDate();
  const db = initializeFirebase();

  const floors = ["LT1", "LT2"];
  const statuses = {};

  for (const floor of floors) {
    statuses[floor] = await getDailyStatus(db, floor, date);
  }

  if (mode === "morning" || mode === "evening") {
    const session = mode === "morning" ? "pagi" : "sore";
    const recipients = getNumbers("PETUGAS_NUMBERS");

    const incomplete = floors
      .map((floor) => ({
        floor,
        items: statuses[floor][session],
      }))
      .filter((entry) => entry.items.length > 0);

    if (!incomplete.length) {
      console.log(`Checklist ${session} LT1 dan LT2 sudah lengkap. Reminder tidak dikirim.`);
      return;
    }

    const details = incomplete
      .map(
        (entry) =>
          `${entry.floor}: ${entry.items.join(", ")}`
      )
      .join("\n");

    const message =
      `REMINDER CHECKLIST TOILET ${session.toUpperCase()}\n\n` +
      `Mohon segera lengkapi checklist berikut:\n${details}\n\n` +
      `Terima kasih.`;

    await sendToNumbers(recipients, message);
    return;
  }

  if (mode === "report") {
    const recipients = getNumbers("SPV_NUMBERS");

    const lines = [
      "LAPORAN HARIAN CHECKLIST TOILET",
      `${String(date.day).padStart(2, "0")}/${String(date.month + 1).padStart(2, "0")}/${date.year}`,
      "",
    ];

    for (const floor of floors) {
      lines.push(`TOILET ${floor}`);

      for (const session of ["pagi", "sore"]) {
        const missing = statuses[floor][session];

        lines.push(
          `${session.toUpperCase()}: ${
            missing.length === 0
              ? "LENGKAP"
              : `BELUM LENGKAP (${missing.join(", ")})`
          }`
        );
      }

      lines.push("");
    }

    await sendToNumbers(recipients, lines.join("\n"));
    return;
  }

  throw new Error("Mode tidak valid: gunakan morning, evening, atau report.");
}

module.exports = { run };
