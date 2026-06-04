const cron = require("node-cron");

const {
  sendMorningReminder,
  sendEveningReminder,
  sendDailyReport,
} = require("./reminder");


// ======================================
// REMINDER PAGI OB
// JAM 09:00
// ======================================

cron.schedule(
  "30 8 * * *",
  async () => {

    console.log(
      "Sending morning reminder..."
    );

    await sendMorningReminder();

  }
);


// ======================================
// REMINDER SORE OB
// JAM 16:00
// ======================================

cron.schedule(
  "30 15 * * *",
  async () => {

    console.log(
      "Sending evening reminder..."
    );

    await sendEveningReminder();

  }
);


// ======================================
// DAILY REPORT PIC
// JAM 17:00
// ======================================

cron.schedule(
  "30 16 * * *",
  async () => {

    console.log(
      "Sending daily report..."
    );

    await sendDailyReport();

  }
);


console.log(
  "Scheduler running..."
);