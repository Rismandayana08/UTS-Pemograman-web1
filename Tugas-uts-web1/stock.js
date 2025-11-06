import { dataKatalogBuku } from "./data.mjs";

const parent = document.getElementById("katalogList");
const stokModal = document.getElementById('stokModal');
const openStokModal = document.getElementById('openStokModal');
const closeStokModal = document.getElementById('closeStokModal');

function checkAdminAccess() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (openStokModal) {
        if (loggedInUser && JSON.parse(loggedInUser).role === 'Admin') {
            openStokModal.style.display = 'block'; 
        } else {
            openStokModal.style.display = 'none'; 
        }
    }
}

function renderKatalog(katalog) {
    if (!parent) return;
    parent.innerHTML = ''; 

    katalog.forEach((item) => {
        const subParent = document.createElement("div");
        subParent.classList.add("card");

      
        const cover = document.createElement("img");
        cover.setAttribute("src", item.cover);
        cover.setAttribute("alt", item.namaBarang);
        cover.style.maxHeight = '250px';
        cover.style.objectFit = 'cover';
        subParent.appendChild(cover);
    
        const title = document.createElement("h3");
        title.innerText = item.namaBarang;
        subParent.appendChild(title);

        const kode = document.createElement("p");
        kode.innerHTML = `<strong>Kode:</strong> ${item.kodeBarang}`;
        subParent.appendChild(kode);
      
        const stok = document.createElement("p");
        stok.innerHTML = `<strong>Stok:</strong> ${item.stok}`;
        subParent.appendChild(stok);

        const price = document.createElement("p");
        price.innerHTML = `<strong>Harga:</strong> ${item.harga}`;
        subParent.appendChild(price);

        const button = document.createElement("button");
        button.classList.add("btn");
        button.innerText = "Tambah ke Keranjang";

        button.setAttribute("onclick", `window.addToCart('${item.kodeBarang}')`); 
        subParent.appendChild(button);

        parent.appendChild(subParent);
    });
}


function handleAddNewStok() {
    const addStokForm = document.getElementById('addStokForm');

    if (openStokModal) openStokModal.onclick = () => { if (stokModal) stokModal.style.display = 'block'; };
    if (closeStokModal) closeStokModal.onclick = () => { if (stokModal) stokModal.style.display = 'none'; };

    window.onclick = function(event) {
        if (event.target === stokModal) {
            stokModal.style.display = 'none';
        }
    };

    if (addStokForm) {
        addStokForm.addEventListener('submit', function(event) {
            event.preventDefault();

           
            const newBuku = {
                kodeBarang: document.getElementById('new_kodeBarang').value,
                namaBarang: document.getElementById('new_namaBarang').value,
                jenisBarang: document.getElementById('new_jenisBarang').value,
                edisi: document.getElementById('new_edisi').value,
                stok: parseInt(document.getElementById('new_stok').value),
                harga: document.getElementById('new_harga').value,
                cover: "./img/default_book.png" 
            };

            if (!newBuku.kodeBarang || !newBuku.namaBarang || isNaN(newBuku.stok)) {
                alert("Semua kolom harus diisi dengan benar.");
                return;
            }


            dataKatalogBuku.push(newBuku);
            renderKatalog(dataKatalogBuku); 
            alert(`Buku "${newBuku.namaBarang}" berhasil ditambahkan!`);
            addStokForm.reset();
            if (stokModal) stokModal.style.display = 'none';
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    renderKatalog(dataKatalogBuku);
    handleAddNewStok();
});