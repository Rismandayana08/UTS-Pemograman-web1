import { dataTracking } from "./data.mjs";

const table = document.getElementById("laporanTableBody")

dataTracking.forEach(item => {
    const row = document.createElement("tr")

    let statusColor = 'orange'; 
    if (item.status === "Dikirim") {
        statusColor = 'green';
    } else if (item.status === "Dalam Perjalanan") {
        statusColor = 'blue';
    }

    row.innerHTML = `
    <td>${item.nomorDO}</td>
    <td>${item.tanggalKirim}</td>
    <td>${item.nama}</td>
    <td>${item.total}</td>
    <td style="font-weight: bold; color: ${statusColor};">${item.status}</td>
    `
    table.appendChild(row)
});