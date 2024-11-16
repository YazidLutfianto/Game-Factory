// Variabel dasar
let gold = 10000;
let items = {
    ironOre: 0,
    ironPlate: 0,
    ironRod: 0,
    ironWire: 0,
    wireMesh: 0
};

let factories = {
    box1: { level: 0, maxLevel: 20, bought: false, productionRate: 2 },
    box2: { level: 0, maxLevel: 20, bought: false, productionRate: 2, selectedProduction: "ironPlate" },
    box3: { level: 0, maxLevel: 20, bought: false, productionRate: 2 }
};

const prices = {
    ironOre: 100,
    ironPlate: 400,
    ironRod: 300,
    ironWire: 150,
    wireMesh: 600
};

let tempProduction = {
    box1: 0,
    box2: { ironPlate: 0, ironRod: 0, ironWire: 0 },
    box3: 0
};

// Variabel waktu
let hour = 0;
let day = 0;
let month = 0;
let year = 0;

function updateTime() {
    hour++;
    if (hour === 24) {
        hour = 0;
        day++;
    }
    if (day > 30) {
        day = 1;
        month++;
    }
    if (month > 12) {
        month = 1;
        year++;
    }
    document.getElementById("time").innerText = `${hour} Jam | ${day} Hari | ${month} Bulan | ${year} Tahun`;
}

// Fungsi untuk memperbarui tampilan resource
function displayResources() {
    document.getElementById("resources").innerText = 
        `Biji Besi: ${items.ironOre} | Plat Besi: ${items.ironPlate} | Batang Besi: ${items.ironRod} | Kawat Besi: ${items.ironWire} | Jaring Kawat: ${items.wireMesh}`;
    document.getElementById("gold").innerText = "Emas: " + gold + "G";
}

// Fungsi untuk membeli pabrik
function buyFactory(boxId) {
    if (!factories[boxId].bought && gold >= 8000) {
        gold -= 8000;
        factories[boxId].bought = true;

        // Sembunyikan tombol beli dan tampilkan tombol klaim dan upgrade
        document.querySelector(`#${boxId} button#buy${boxId.charAt(0).toUpperCase() + boxId.slice(1)}`).style.display = 'none'; // Menyembunyikan tombol Beli
        document.querySelector(`#${boxId} button.claim-button`).style.display = 'inline-block'; // Menampilkan tombol klaim
        document.getElementById(`upgrade${boxId.charAt(0).toUpperCase() + boxId.slice(1)}`).style.display = 'inline-block'; // Menampilkan tombol upgrade

        displayResources(); // Memperbarui tampilan resource
    } else if (gold < 8000) {
        alert("Emas tidak cukup!");
    }
}


// Fungsi untuk meng-upgrade pabrik
function upgradeFactory(boxId) {
    if (factories[boxId].bought && factories[boxId].level < factories[boxId].maxLevel) {
        let upgradeCost = factories[boxId].level * 1000; // Biaya meningkat dengan kelipatan level
        if (gold >= upgradeCost) {
            gold -= upgradeCost;
            factories[boxId].level++;
            factories[boxId].productionRate += 2; // Tambah produksi per level

            // Update teks level dan biaya upgrade
            document.querySelector(`#${boxId} h2`).innerText = `${boxId === "box1" ? "Penambang Biji Besi" : boxId === "box2" ? "Peleburan Besi" : "Pembuatan Jaring Kawat"} Lv${factories[boxId].level}`;
            displayResources();
        } else {
            alert("Emas tidak cukup!");
        }
    } else if (factories[boxId].level >= factories[boxId].maxLevel) {
        alert("Factory telah mencapai level maksimum!");
    }
}

// Fungsi untuk klaim item dari setiap factory
function claimItems(boxId) {
    if (boxId === "box1") {
        items.ironOre += tempProduction[boxId];
        tempProduction[boxId] = 0; // Reset jumlah produksi sementara
    } else if (boxId === "box2") {
        for (let key in tempProduction[boxId]) {
            items[key] += tempProduction[boxId][key];
            tempProduction[boxId][key] = 0; // Reset produksi sementara
        }
    } else if (boxId === "box3") {
        items.wireMesh += tempProduction[boxId];
        tempProduction[boxId] = 0; // Reset jumlah produksi sementara
    }
    displayResources(); // Perbarui tampilan resources
}

// Fungsi untuk memilih item produksi di box2
function chooseProduction(boxId) {
    let select = document.getElementById("ItemSelect");
    factories[boxId].selectedProduction = select.value;
}

// Fungsi untuk menjual item
function sellItems() {
    let selectedItem = document.getElementById("sellItemSelect").value;
    let quantityOption = document.getElementById("sellQuantitySelect").value;
    let quantity = quantityOption === "custom" ? parseInt(document.getElementById("sellCustomQuantity").value) : parseInt(quantityOption);

    if (items[selectedItem] >= quantity) {
        let price = prices[selectedItem];
        let totalPrice = price * quantity;
        items[selectedItem] -= quantity;
        gold += totalPrice;
        document.getElementById("sellPriceDisplay").innerText = `Harga total: ${totalPrice}G`;
        displayResources();
    } else {
        alert("Jumlah item tidak cukup untuk dijual!");
    }
}

// Fungsi untuk memperbarui harga jual
function updateSellPrice() {
    let selectedItem = document.getElementById("sellItemSelect").value;
    let quantityOption = document.getElementById("sellQuantitySelect").value;
    let quantity = quantityOption === "custom" ? parseInt(document.getElementById("sellCustomQuantity").value) : parseInt(quantityOption);
    let price = prices[selectedItem];
    let totalPrice = price * quantity;
    document.getElementById("sellPriceDisplay").innerText = `Harga total: ${totalPrice}G`;
}

// Fungsi untuk otomatisasi produksi setiap detik
setInterval(() => {
    updateTime();

    if (factories.box1.bought) {
        tempProduction.box1 += factories.box1.productionRate; // Tambah ke produksi sementara
        document.getElementById("outputBox1").innerText = tempProduction.box1; // Menampilkan hasil produksi di factory box1
    }

    if (factories.box2.bought) {
        let production = factories.box2.selectedProduction;
        if (production === "ironPlate" && items.ironOre >= 3) {
            tempProduction.box2.ironPlate += factories.box2.productionRate;
            document.getElementById("ironPlateCount").innerText = tempProduction.box2.ironPlate; // Menampilkan hasil produksi Plat Besi
        } else if (production === "ironRod" && items.ironOre >= 2) {
            tempProduction.box2.ironRod += factories.box2.productionRate;
            document.getElementById("ironRodCount").innerText = tempProduction.box2.ironRod; // Menampilkan hasil produksi Batang Besi
        } else if (production === "ironWire" && items.ironOre >= 1) {
            tempProduction.box2.ironWire += factories.box2.productionRate;
            document.getElementById("ironWireCount").innerText = tempProduction.box2.ironWire; // Menampilkan hasil produksi Kawat Besi
        }
    }

    if (factories.box3.bought) {
        tempProduction.box3 += factories.box3.productionRate; // Tambah ke produksi sementara
        document.getElementById("outputBox3").innerText = tempProduction.box3; // Menampilkan hasil produksi di factory box3
    }

    displayResources(); // Tampilkan hasil sementara
}, 1000);

displayResources();











document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        console.log('Scroll Position:', scrollPosition); // Debugging
        let statusBar = document.getElementById('status-bar');

        if (scrollPosition > 100) {
            console.log('Menampilkan status bar'); // Debugging
            statusBar.style.opacity = '1';
            statusBar.style.pointerEvents = 'all';
        } else {
            console.log('Menyembunyikan status bar'); // Debugging
            statusBar.style.opacity = '0';
            statusBar.style.pointerEvents = 'none';
        }
    });
});

