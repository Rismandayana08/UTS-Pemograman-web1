let currentDataPengguna = []; 
let shoppingCart = []; 

window.handleLogout = function() {
    localStorage.removeItem('loggedInUser'); 
    window.location.href = 'index.html'; 
}


window.addToCart = function(kodeBarang) {
    if (typeof dataKatalogBuku === 'undefined') {
        alert("Data katalog tidak ditemukan.");
        return;
    }

    const buku = dataKatalogBuku.find(b => b.kodeBarang === kodeBarang);
    if (!buku) return;

    const existingItem = shoppingCart.find(item => item.kodeBarang === kodeBarang);

    if (existingItem) {
        existingItem.qty += 1; 
        alert(`Kuantitas ${buku.namaBarang} diperbarui menjadi ${existingItem.qty}`);
    } else {
        shoppingCart.push({
            kodeBarang: buku.kodeBarang,
            namaBarang: buku.namaBarang,
            harga: buku.harga,
            qty: 1
        });
        alert(`Buku "${buku.namaBarang}" berhasil ditambahkan ke keranjang!`);
    }
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

window.updateCartQty = function(index, newQty) {
    const qty = parseInt(newQty);
    if (qty > 0) {
        shoppingCart[index].qty = qty;
        renderCartTable();
    } else {
        alert("Kuantitas harus lebih dari 0.");
    }
}

window.removeFromCart = function(index) {
    const deletedItem = shoppingCart[index].namaBarang;
    shoppingCart.splice(index, 1); 
    alert(`${deletedItem} berhasil dihapus dari keranjang.`);
    renderCartTable();
}


function loadUserData() {
  
    const localUsers = localStorage.getItem('allUsers');
    
    if (localUsers) {
        currentDataPengguna = JSON.parse(localUsers);
    } else {
        if (typeof dataPengguna !== 'undefined') { 
            currentDataPengguna = dataPengguna; 
            localStorage.setItem('allUsers', JSON.stringify(dataPengguna));
        }
    }
}

function displayAdminFeatures() {
    const adminPanel = document.getElementById('adminMenu');
    const userPanel = document.getElementById('userMenu');
    if (adminPanel) adminPanel.style.display = 'grid';
    if (userPanel) userPanel.style.display = 'none'; 
}

function displayUserFeatures() {
    const adminPanel = document.getElementById('adminMenu');
    const userPanel = document.getElementById('userMenu');
    if (adminPanel) adminPanel.style.display = 'none';
    if (userPanel) userPanel.style.display = 'grid'; 
}

function showGreeting() {
    const date = new Date();
    const hour = date.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Selamat Pagi";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Selamat Siang";
    } else if (hour >= 17 && hour < 20) {
        greeting = "Selamat Sore";
    } else {
        greeting = "Selamat Malam";
    }

    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const userName = loggedInUser ? JSON.parse(loggedInUser).nama : "Pengguna";
        const role = loggedInUser ? JSON.parse(loggedInUser).role : "";
        
        greetingElement.textContent = `${greeting}, ${userName}! (${role})`; 
        
        if (role === 'Admin') {
            displayAdminFeatures();
        } else {
            displayUserFeatures();
        }
    }
}


function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = document.getElementById('email').value;
            const passwordInput = document.getElementById('password').value;

            const user = currentDataPengguna.find(
                u => u.email === emailInput && u.password === passwordInput
            );

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert("Email/password yang Anda masukkan salah");
            }
        });

        const lupaPasswordModal = document.getElementById('lupaPasswordModal');
        const daftarModal = document.getElementById('daftarModal');
        const closeBtns = document.querySelectorAll('.close-btn');

        document.getElementById('lupaPasswordBtn').onclick = () => {
            if (lupaPasswordModal) lupaPasswordModal.style.display = 'block';
        };

        document.getElementById('daftarBtn').onclick = () => {
            if (daftarModal) daftarModal.style.display = 'block';
        };

        closeBtns.forEach(btn => {
            btn.onclick = function() {
                btn.closest('.modal').style.display = 'none';
            };
        });

        window.onclick = function(event) {
            if (event.target === lupaPasswordModal) {
                lupaPasswordModal.style.display = 'none';
            }
            if (event.target === daftarModal) {
                daftarModal.style.display = 'none';
            }
        };
    }
}

function handleRegistration() {
    const daftarModal = document.getElementById('daftarModal');
    const registerButton = document.getElementById('submitDaftar');

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const inputs = daftarModal.querySelectorAll('input');
            const nama = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const password = inputs[2].value.trim();

            if (!nama || !email || !password) {
                alert("Semua kolom (Nama, Email, Password) wajib diisi.");
                return;
            }

            const isEmailExist = currentDataPengguna.some(u => u.email === email);
            if (isEmailExist) {
                alert("Gagal: Email ini sudah terdaftar. Silakan gunakan email lain.");
                return;
            }

            const newUser = {
                id: currentDataPengguna.length + 1,
                nama: nama,
                email: email,
                password: password,
                role: "User",
            };

            currentDataPengguna.push(newUser);
            
            localStorage.setItem('allUsers', JSON.stringify(currentDataPengguna)); 

            alert(`Pendaftaran berhasil! Selamat datang, ${nama}. Anda sekarang bisa login.`);

            daftarModal.style.display = 'none';
            document.getElementById('daftarForm').reset();
        });
    }
}


function initDashboard() {
    showGreeting();
}

function initCheckout() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        shoppingCart = JSON.parse(savedCart);
    }
    
    renderCartTable();
    handleCheckoutSubmit();
}

function renderCartTable() {
    const cartTableBody = document.getElementById('cartTableBody');
    const totalElement = document.getElementById('grandTotal');
    
    if (!cartTableBody || !totalElement) return;

    cartTableBody.innerHTML = ''; 
    let grandTotal = 0;

    shoppingCart.forEach((item, index) => {
        const priceString = item.harga.replace('Rp ', '').replace('.', '');
        const priceNum = parseInt(priceString.replace(/,/g, ''));
        if(isNaN(priceNum)) return;
        
        const subtotalNum = priceNum * item.qty;
        grandTotal += subtotalNum;

        const row = cartTableBody.insertRow();
        row.innerHTML = `
            <td>${item.kodeBarang}</td>
            <td>${item.namaBarang}</td>
            <td>${item.harga}</td>
            <td>
                <input type="number" value="${item.qty}" min="1" 
                       style="width: 50px; text-align: center;" 
                       onchange="updateCartQty(${index}, this.value)">
            </td>
            <td>Rp ${subtotalNum.toLocaleString('id-ID')}</td>
            <td>
                <button class="btn-secondary" style="padding: 5px 10px;" onclick="removeFromCart(${index})">Hapus</button>
            </td>
        `;
    });

    totalElement.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function handleCheckoutSubmit() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (shoppingCart.length === 0) {
                alert("Keranjang belanja Anda kosong. Silakan tambahkan buku terlebih dahulu.");
                return;
            }

            const namaPemesan = document.getElementById('namaPemesan').value;
            const alamat = document.getElementById('alamat').value;
            const metodeBayar = document.getElementById('metodeBayar').value;
            
            if (!namaPemesan || !alamat || !metodeBayar) {
                alert("Mohon lengkapi semua data pemesan dan pembayaran.");
                return;
            }

            alert(`Pemesanan Berhasil!\n\nNama: ${namaPemesan}\nTotal Item: ${shoppingCart.length}\nTotal Bayar: ${document.getElementById('grandTotal').textContent}\nPesanan Anda akan segera diproses.`);

            shoppingCart = [];
            localStorage.removeItem('shoppingCart');
            renderCartTable();
            checkoutForm.reset();
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadUserData(); 
    if (document.body.classList.contains('login-page')) {
        handleLogin();
        handleRegistration();
    } else if (document.body.classList.contains('dashboard-page')) {
        initDashboard(); 
    } else if (document.body.classList.contains('checkout-page')) {
        initCheckout();
    }
});