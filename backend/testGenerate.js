import generateDailyReport from "./services/generateDailyReport.js";

const run = async () => {

  const result =
    await generateDailyReport({

      location: "Toilet PMA Lt 4",

      date: "21 Mei 2026",

      morningInspector: "RONI",

      eveningInspector: "BUDI",

      morningChecks: [
        {
          label: "Lantai",
          checked: true,
        },
        {
          label: "Closet",
          checked: true,
        },
        {
          label: "Wastafel",
          checked: false,
        },
        {
          label: "Sabun",
          checked: true,
        },
        {
          label: "Tissue",
          checked: true,
        },
      ],

      eveningChecks: [
        {
          label: "Lantai",
          checked: true,
        },
        {
          label: "Closet",
          checked: false,
        },
        {
          label: "Wastafel",
          checked: true,
        },
        {
          label: "Sabun",
          checked: true,
        },
        {
          label: "Tissue",
          checked: false,
        },
      ],

      completion: 80,
    });

  console.log(result);
};

run();