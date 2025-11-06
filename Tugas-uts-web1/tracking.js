// tracking.js
import { dataTracking } from "./data.mjs";

document.addEventListener('DOMContentLoaded', () => {
    initTracking();
});

function initTracking() {
    const trackingForm = document.getElementById("trackingForm");
    const inputData = document.getElementById("doNumber");
    const trackingResultDiv = document.getElementById("trackingResult");
    
    if (!trackingForm || !inputData || !trackingResultDiv) return;

    trackingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const inputDataString = inputData.value.trim(); 

        const result = dataTracking.find(item => item.nomorDO === inputDataString);
        
        trackingResultDiv.innerHTML = ''; 

        if (result) {
          
            let statusColor = 'orange'; 
            let progressWidth = '20%';

            if (result.status === 'Dikirim') {
                statusColor = 'green';
                progressWidth = '100%';
            } else if (result.status === 'Dalam Perjalanan') {
                statusColor = 'blue';
                progressWidth = '60%';
            }

            const historyHTML = result.perjalanan.map(log => `
                <li><strong>[${log.waktu}]</strong> ${log.keterangan}</li>
            `).join('');

            trackingResultDiv.innerHTML = `
                <h3>Detail Pengiriman: #${result.nomorDO}</h3>
                <div class="tracking-detail">
                    <p><strong>Nama Pemesan:</strong> ${result.nama}</p>
                    <p><strong>Status Pengiriman:</strong> 
                        <span style="font-weight: bold; color: ${statusColor};">${result.status}</span>
                    </p>
                    <div class="progress-container">
                        <label>Simulasi Progress:</label>
                        <div class="progress-bar">
                            <div class="progress ${result.status.toLowerCase().replace(/ /g, '-')}" style="width: ${progressWidth};">${result.status}</div>
                        </div>
                    </div>
                    <p><strong>Ekspedisi:</strong> ${result.ekspedisi}</p>
                    <p><strong>Tanggal Kirim:</strong> ${result.tanggalKirim}</p>
                    <p><strong>Jenis Paket:</strong> ${result.paket}</p>
                    <p><strong>Total Pembayaran:</strong> ${result.total}</p>
                </div>

                <div class="tracking-history">
                    <h4>Riwayat Perjalanan:</h4>
                    <ul style="list-style-type: none; padding-left: 0;">
                        ${historyHTML} 
                    </ul>
                </div>
            `;
        } else {
            trackingResultDiv.innerHTML = '<p style="color: red;">Nomor Delivery Order tidak ditemukan.</p>';
        }
    });
}