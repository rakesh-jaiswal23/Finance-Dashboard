export function downloadFile(filename, data, mime) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTransactionsJson(transactions) {
  downloadFile("transactions.json", JSON.stringify(transactions, null, 2), "application/json");
}

export function exportTransactionsCsv(transactions) {
  const header = "date,description,category,type,amount";
  const rows = transactions.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`);
  downloadFile("transactions.csv", [header, ...rows].join("\n"), "text/csv");
}
