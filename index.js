const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Simpan status invoice
const invoiceStatus = {};

// Endpoint callback dari Tripay
app.post("/callback", (req, res) => {
  const { invoice_reference, status } = req.body.data;
  console.log("Callback diterima:", invoice_reference, status);

  if (status === "PAID") {
    invoiceStatus[invoice_reference] = "PAID";
  }

  res.status(200).send("Callback diterima");
});

// Endpoint buat frontend cek status invoice
app.get("/status/:invoice", (req, res) => {
  const invoice = req.params.invoice;
  const status = invoiceStatus[invoice] || "UNPAID";
  res.json({ invoice, status });
});

app.get("/", (req, res) => {
  res.send("Backend Tripay jalan 🚀");
});

app.listen(port, () => {
  console.log('Server running at http://localhost:${port}');
});
