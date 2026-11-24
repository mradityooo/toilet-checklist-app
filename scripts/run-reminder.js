
const {
  sendMorningReminder,
  sendEveningReminder,
  sendDailyReport,
} = require("../backend/reminder.js");

async function main() {
  const mode = process.argv[2];

  try {
    if (mode === "morning") {
      console.log("Menjalankan reminder pagi...");
      await sendMorningReminder();
    } else if (mode === "evening") {
      console.log("Menjalankan reminder sore...");
      await sendEveningReminder();
    } else if (mode === "report") {
      console.log("Mengirim laporan harian...");
      await sendDailyReport();
    } else {
      throw new Error(
        "Mode tidak valid. Gunakan: morning, evening, atau report."
      );
    }

    console.log("Proses selesai.");
  } catch (error) {
    console.error("Gagal menjalankan proses:", error);
    process.exitCode = 1;
  }
}

main();
