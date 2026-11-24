
const { run } = require("./whatsapp-service.js");

const mode = process.argv[2];

console.log(`Menjalankan layanan WhatsApp: ${mode}`);

run(mode)
  .then(() => {
    console.log("Proses WhatsApp selesai.");
  })
  .catch((error) => {
    console.error(
      "Proses WhatsApp gagal:",
      error.response?.data || error
    );
    process.exitCode = 1;
  });
