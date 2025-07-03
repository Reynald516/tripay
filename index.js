const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML/CSS dari /public

// Simpan status invoice
const invoiceStatus = {};

// GANTI dengan API Key asli Tripay kamu
const TRIPAY_API_KEY = "ISI_API_KEY_KAMU_DI_SINI";

// Endpoint callback Tripay
app.post("/callback", (req, res) => {
  const { invoice_reference, status } = req.body.data;
  console.log("Callback diterima:", invoice_reference, status);

  if (status === "PAID") {
    invoiceStatus[invoice_reference] = "PAID";
  }

  res.status(200).send("Callback diterima");
});

// Endpoint untuk cek status invoice dari frontend
app.get("/status/:invoice", (req, res) => {
  const invoice = req.params.invoice;
  const status = invoiceStatus[invoice] || "UNPAID";
  res.json({ invoice, status });
});

// Endpoint untuk buat invoice baru
app.post("/create-invoice", async (req, res) => {
  try {
    const { name, email } = req.body;

    const data = {
      method: "QRIS",
      merchant_ref: "INV" + Date.now(),
      amount: 10000,
      customer_name: name,
      customer_email: email,
      order_items: [
        {
          sku: "premium1",
          name: "Akses Chatbot Premium",
          price: 10000,
          quantity: 1,
        },
      ],
      callback_url: "https://tripay.up.railway.app/callback", // GANTI ini dengan domain Railway kamu
      return_url: "https://tripay.up.railway.app/success.html",
      expired_time: Math.floor(Date.now() / 1000) + 24 * 3600,
    };

    const tripayRes = await axios.post(
      "https://tripay.co.id/api/transaction/create",
      data,
      {
        headers: {
          Authorization: Bearer ${TRIPAY_API_KEY},
        },
      }
    );

    res.json({
      invoice_url: tripayRes.data.data.checkout_url,
      reference: tripayRes.data.data.reference,
    });
  } catch (err) {
    console.error("Gagal buat invoice:", err.response?.data || err.message);
    res.status(500).json({ error: "Gagal membuat invoice" });
  }
});

// Serve halaman index.html dari folder /public
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(Server running at http://localhost:${port});
});
