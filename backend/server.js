require("dotenv").config();

const axios = require("axios");
const cron = require("node-cron");
const db = require("./firebase");

const OB_NUMBER = "6283187706894";

const PIC_NUMBER = "6285117057996";

async function sendWA() {
  async function sendDailyReport() {

  try {

    const currentDate = new Date();

    const month = currentDate.getMonth();

    const year = currentDate.getFullYear();

    const docId = `${year}-${month}-1`;

    const docRef =
      db.collection("checklists").doc(docId);

    const snapshot = await docRef.get();

    if (!snapshot.exists) {

      console.log("Data checklist tidak ada");

      return;
    }

    const data = snapshot.data();

    const fields = [
      "Lantai",
      "Closet",
      "Wastafel",
      "Sabun",
      "Tissue",
    ];

    let totalChecklist = 0;

    let totalIssue = 0;

    const inspectors = new Set();

    for (let day = 1; day <= 31; day++) {

      fields.forEach((field) => {

        ["pagi", "sore"].forEach((session) => {

          totalChecklist++;

          const checked =
            data?.[day]?.[field]?.[session];

          if (!checked) {

            totalIssue++;
          }
        });
      });

      const pagiInspector =
        data?.inspectors?.[day]?.pagi;

      const soreInspector =
        data?.inspectors?.[day]?.sore;

      if (pagiInspector)
        inspectors.add(pagiInspector);

      if (soreInspector)
        inspectors.add(soreInspector);
    }

    const inspectorList =
      [...inspectors].join(", ") || "-";

    const message =
`🤖 TOILET MONITORING BOT

📋 DAILY REPORT
Toilet PMA Lt 4

📅 Tanggal:
${currentDate.toLocaleDateString("id-ID")}

✅ Total Checklist:
${totalChecklist}

⚠️ Total Issue:
${totalIssue}

👨‍🔧 Inspector Aktif:
${inspectorList}

Status:
${
  totalIssue > 0
    ? "Masih terdapat checklist yang belum complete."
    : "Checklist complete."
}

Terima kasih.`;

    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target: PIC_NUMBER,
        message,
      },
      {
        headers: {
          Authorization:
            process.env.FONNTE_TOKEN,
        },
      }
    );

    console.log("Daily report berhasil");

    console.log(response.data);

  } catch (error) {

    console.log(error.response?.data || error.message);
  }
}
  console.log("Fungsi sendWA jalan");

  try {
    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target: OB_NUMBER,
        message:
        `🤖 TOILET MONITORING BOT

        Reminder Checklist Toilet PMA Lt 4

        ⚠️ Checklist sesi pagi belum lengkap.

        Mohon segera melakukan pengecekan.

        Terima kasih.`
        ,
      },
      {
        headers: {
          Authorization: process.env.FONNTE_TOKEN,
        },
      }
    );

    console.log("WA berhasil");
    console.log(response.data);
  } catch (error) {
    console.log("ERROR:");
    console.log(error.response?.data || error.message);
  }
}

// tiap 1 menit
cron.schedule("0 9 * * *", async () => {

  console.log("REMINDER PAGI");

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const docId = `${year}-${month}-1`;
  const docRef = db.collection("checklists").doc(docId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {

    console.log("Checklist pagi tidak ada");
    await sendWA();
    return;
  }

  const data = snapshot.data();
  let incomplete = false;

  for (let day = 1; day <= 31; day++) {
    const fields = data?.[day];

    if (!fields) {
      incomplete = true;
      break;
    }

  }

  if (incomplete) {

    console.log("Checklist pagi belum lengkap");
    await sendWA();

  } else {
    console.log("Checklist pagi lengkap");
  }

});

cron.schedule("0 16 * * *", async () => {

  console.log("REMINDER SORE");

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const docId = `${year}-${month}-1`;
  const docRef = db.collection("checklists").doc(docId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {

    console.log("Checklist sore tidak ada");
    await sendWA();
    return;
  }

  const data = snapshot.data();
  let incomplete = false;

  for (let day = 1; day <= 31; day++) {
    const fields = data?.[day];

    if (!fields) {
      incomplete = true;
      break;
    }
  }

  if (incomplete) {

    console.log("Checklist sore belum lengkap");
    await sendWA();

  } else {
    console.log("Checklist sore lengkap");
  }

});

console.log("Scheduler aktif...");

cron.schedule("0 17 * * *", async () => {

  console.log("KIRIM DAILY REPORT");

  await sendDailyReport();

});