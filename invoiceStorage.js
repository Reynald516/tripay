// invoiceStorage.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "invoices.json");

function loadInvoices() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveInvoices(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function updateInvoiceStatus(reference, status) {
  const invoices = loadInvoices();
  invoices[reference] = status;
  saveInvoices(invoices);
}

function getInvoiceStatus(reference) {
  const invoices = loadInvoices();
  return invoices[reference] || "UNPAID";
}

module.exports = {
  updateInvoiceStatus,
  getInvoiceStatus
};
