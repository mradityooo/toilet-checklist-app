  require("dotenv").config();

  const generateDailyReport =
  require("./services/generateDailyReport").default;

  const axios = require("axios");

  const admin =
  require("firebase-admin");

  const serviceAccount =
  require("./firebase-service-account.json");

  admin.initializeApp({
    credential:
      admin.credential.cert(serviceAccount),

  });

  const db = admin.firestore();

    const toilets = [

    {
      id: "LT1",
      location:
        "TOILET LT 1",
    },

    {
      id: "LT2",
      location:
        "TOILET LT 2",
    },

  ];

  // ======================================
  // MORNING REMINDER
  // ======================================

const sendMorningReminder =
async () => {

  const now = new Date();

  const month =
    now.getMonth();

  const year =
    now.getFullYear();

  const today =
    now.getDate();

  const docId =
    `${year}-${month}-1`;

  const fields = [
    "Lantai",
    "Closet",
    "Wastafel",
    "Sabun",
    "Tissue",
  ];

  for (const toilet of toilets) {

    const snapshot =
      await db
        .collection("checklists")
        .doc(toilet.id)
        .collection("months")
        .doc(docId)
        .get();

    const data =
      snapshot.data();

console.log(
  "TOILET:",
  toilet.id
);

console.log(
  "DOC ID:",
  docId
);

console.log(
  "DATA:",
  data
);

    const todayData =
      data?.[today] || {};

    const isComplete =
      fields.every(
        (field) =>
          todayData?.[field]
            ?.pagi
      );

    if (!isComplete) {

      await axios({
        method: "POST",

        url:
          "https://api.fonnte.com/send",

        data: {

          target:
            "6283187706894",

          message:
          `Reminder Checklist Toilet

          Checklist pagi ${toilet.location} belum diisi.

          Mohon segera dilakukan sebelum 09:00.`,
                  },

        headers: {
          Authorization:
            process.env.FONNTE_TOKEN,
        },
      });

      console.log(
        `${toilet.location} reminder pagi terkirim`
      );

    }

  }

};


  // ======================================
  // EVENING REMINDER
  // ======================================

const sendEveningReminder =
async () => {

  const now = new Date();

  const month =
    now.getMonth();

  const year =
    now.getFullYear();

  const today =
    now.getDate();

  const docId =
    `${year}-${month}-1`;

  const fields = [
    "Lantai",
    "Closet",
    "Wastafel",
    "Sabun",
    "Tissue",
  ];

  for (const toilet of toilets) {

    const snapshot =
      await db
        .collection("checklists")
        .doc(toilet.id)
        .collection("months")
        .doc(docId)
        .get();

    const data =
      snapshot.data();

    const todayData =
      data?.[today] || {};

    const isComplete =
      fields.every(
        (field) =>
          todayData?.[field]
            ?.sore
      );

    if (!isComplete) {

      await axios({
        method: "POST",

        url:
          "https://api.fonnte.com/send",

        data: {

          target:
            "6283187706894",

          message:
          `Reminder Checklist Toilet

          Checklist sore ${toilet.location} belum diisi.

          Mohon segera dilakukan sebelum 16:00.`,
                  },

        headers: {
          Authorization:
            process.env.FONNTE_TOKEN,
        },
      });

      console.log(
        `${toilet.location} reminder sore terkirim`
      );

    }

  }

};


  // ======================================
  // DAILY REPORT
  // ======================================

  const sendDailyReport =
  async () => {

    try {

      for (const toilet of toilets) {

      const now = new Date();

      const month = now.getMonth();

      const year = now.getFullYear();

      const docId =
      `${year}-${month}-1`;

      // =====================================
      // QUERY DATA FIRESTORE
      // =====================================

      const snapshot =
      await db
        .collection("checklists")
        .doc(toilet.id)
        .collection("months")
        .doc(docId)
        .get();

      const data =
        snapshot.data();

      const today =
      now.getDate();

      const todayData =
      data?.[today] || {};

      const morningInspector =
      data?.inspectors?.[today]
      ?.pagi || "-";

      const eveningInspector =
      data?.inspectors?.[today]
      ?.sore || "-";

      const fields = [
        "Lantai",
        "Closet",
        "Wastafel",
        "Sabun",
        "Tissue",
      ];

      let checked = 0;
      let total = 0;

      fields.forEach((field) => {

        total += 2;

        if (
          todayData?.[field]?.pagi
        ) {
          checked++;
        }

        if (
          todayData?.[field]?.sore
        ) {
          checked++;
        }

      });

      const completion =
      Math.round(
        (checked / total) * 100
      );

      console.log(data);

      // =====================================
      // GENERATE REPORT
      // =====================================
    
      const reportPath =
        await generateDailyReport({

          location:
          toilet.location,

          date:
            new Date().toLocaleDateString(
              "id-ID"
            ),

      morningInspector,
      eveningInspector,
      completion,

        morningChecks: fields.map(
          (field) => ({
            label: field,
            ok:
              todayData?.[field]
              ?.pagi || false,
          })
        ),

        eveningChecks: fields.map(
          (field) => ({
            label: field,
            ok:
              todayData?.[field]
              ?.sore || false,
          })
        ),

        });

      console.log(
        "Report generated:",
        reportPath
      );
    
      // =====================================
  // SEND WHATSAPP
  // =====================================

const response =
await axios({
  method: "POST",

  url:
    "https://api.fonnte.com/send",

  data: {

    target:
      "6283187706894",

    message:
`DAILY TOILET REPORT

${toilet.location}
${new Date().toLocaleDateString("id-ID")}

Pagi : ${morningInspector}
Sore : ${eveningInspector}

Completion : ${completion}%

PAGI
${fields.map((field) => {

  const checked =
    todayData?.[field]
    ?.pagi;

  return `${checked ? "✓" : "✗"} ${field}`;

}).join("\n")}

SORE
${fields.map((field) => {

  const checked =
    todayData?.[field]
    ?.sore;

  return `${checked ? "✓" : "✗"} ${field}`;

}).join("\n")}
`,
  },

  headers: {
    Authorization:
      process.env.FONNTE_TOKEN,
  },
});

  console.log(
    response.data
  );

      console.log(
        "WhatsApp report terkirim"
      );
    }
    } catch (err) {

      console.log(err);

    }
  };

  // ======================================
  // EXPORT
  // ======================================

  module.exports = {
    sendMorningReminder,
    sendEveningReminder,
    sendDailyReport,
  };