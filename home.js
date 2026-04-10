/* modules navigation*/
function show(Class){
    document.querySelector(".admin-profile").classList.add("hidden");
    document.querySelector(".dashboard").classList.add("hidden");
    document.querySelector(".medicine").classList.add("hidden");
    document.querySelector(".inventory").classList.add("hidden");
    document.querySelector(".billing").classList.add("hidden");
    document.querySelector(".supplier").classList.add("hidden");
    document.querySelector(".reports").classList.add("hidden");
    document.querySelector(".setting").classList.add("hidden");
    document.querySelector("." + Class).classList.remove("hidden");    
}
/* sidebar module active style */
document.querySelectorAll(".sidebar div").forEach(btn=>{
    btn.addEventListener("click", function(){
        document.querySelectorAll(".sidebar div").forEach(b=>{
            b.classList.remove("active");
        });
        this.classList.add("active");
    });
});
function getExpiryStatus(expiry) {  /* Logic:   expired → 0 days or less   expiring soon → within 30 days*/ 
    let today = new Date();
    let expDate = new Date(expiry);

    let diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays <= 0) return "Expired";
    else if (diffDays <= 30) return "Soon";
    else return "Safe";
}
function applyExpiryColor(cell) {
    let status = cell.textContent.trim();

    if (status === "Expired") {
        cell.style.color = "red";
    } 
    else if (status === "Soon") {
        cell.style.color = "orange";
    } 
    else {
        cell.style.color = "green";
    }
}
function applyStockStyle(row, qty) {
    let qtyCell = row.cells[6];
    if (qty <= 20) {
        qtyCell.style.color = "red";
    } 
    else if (qty <= 50) {
        qtyCell.style.color = "orange";
    } 
    else {
        qtyCell.style.color = "green";

    }
}
let deleteRowRef = null;   /* global variable use for deletion*/
function deleteMedicine(btn) {
    deleteRowRef = btn.parentNode.parentNode;

    document.getElementById("confirmMsg").innerText = "Delete this medicine?";
    document.getElementById("confirmBox").style.display = "block";
}
function confirmYes() {
    if (deleteRowRef) {
        deleteRowRef.remove();
        updateMedDropdown(); // ✅ update billing dropdown
        loadMed();
    }
    document.getElementById("confirmBox").style.display = "none";
}
function confirmNo() {
    deleteRowRef = null;
    document.getElementById("confirmBox").style.display = "none";
}

function refreshSystem() {
    updateDashboardStock();
    loadMed();
    applyStockStatus();
}
/* profile============================================================================================= */
// Load Profile from localStorage
window.addEventListener("DOMContentLoaded", () => {
    let data = JSON.parse(localStorage.getItem("profile"));
    if (!data) {
        // default data
        data = {
            username: "Mr. Abcdef",
            email: "abcdef@email.com",
            phone: "9998886665",
            fullname: "abcdef ghij",
            dob: "",
            gender: "male",
            location: "patna",
            city: "patna",
            state: "bihar",
            pin: "801503"
        };
    }
    // Fill fields
    document.getElementById("acc-user-name").value = data.username;
    document.getElementById("acc-user-email").value = data.email;
    document.getElementById("acc-user-ph").value = data.phone;
    document.getElementById("acc-user-fullname").value = data.fullname;
    document.getElementById("acc-user-dob").value = data.dob;
    document.getElementById("acc-user-gender").value = data.gender;
    document.getElementById("acc-user-loc").value = data.location;
    document.getElementById("acc-user-city").value = data.city;
    document.getElementById("acc-user-state").value = data.state;
    document.getElementById("acc-user-pin").value = data.pin;

});
document.querySelector(".edit-btn").addEventListener("click", () => {

    document.querySelectorAll(".profile-right input").forEach(input => {
        input.disabled = false;
    });

    document.querySelector(".save-btn").classList.remove("hidden");
});
document.querySelector(".save-btn").addEventListener("click", () => {
    let data = {
        username: document.getElementById("acc-user-name").value,
        email: document.getElementById("acc-user-email").value,
        phone: document.getElementById("acc-user-ph").value,
        fullname: document.getElementById("acc-user-fullname").value,
        dob: document.getElementById("acc-user-dob").value,
        gender: document.getElementById("acc-user-gender").value,
        location: document.getElementById("acc-user-loc").value,
        city: document.getElementById("acc-user-city").value,
        state: document.getElementById("acc-user-state").value,
        pin: document.getElementById("acc-user-pin").value
        };

    // Save to localStorage
    localStorage.setItem("profile", JSON.stringify(data));

    // Disable again
    document.querySelectorAll(".profile-right input").forEach(input => {
        input.disabled = true;
    });

    document.querySelector(".save-btn").classList.add("hidden");

    function updateTopProfile(data) {
   // Navbar
    document.querySelector(".user-name").textContent = data.username;
    document.querySelector(".user-email").textContent = data.email;
    // Profile section (below image)
    document.getElementById("profile-name").textContent = data.username;
    document.getElementById("profile-email").textContent = data.email;
    // Image (if exists)
    if (data.image) {
        document.getElementById("profileImage").src = data.image;

        let navImg = document.getElementById("navProfileImg");
        if (navImg) navImg.src = data.image;
    }
}
    updateTopProfile(data);

    alert("Profile Updated Successfully!");
});

/* dashboard ======================================================================================*/
function showLowStock() {
    let box = document.getElementById("stockListBox");
    // ✅ TOGGLE
    if (box.style.display === "block") {
        box.style.display = "none";
        return;
    }
    let medRows = document.querySelectorAll(".medicine tbody tr");
    let stockList = document.getElementById("stockList");
    stockList.innerHTML = ""; // clear old data
    medRows.forEach(row => {
        let medId = row.cells[0].textContent.trim();
        let medName = row.cells[2].textContent.trim();
        let qty = parseInt(row.cells[6].textContent) || 0;
        if (qty <= 50) {
            let tr = document.createElement("tr");
            let color = (qty <= 20) ? "red" : "orange";
            tr.innerHTML = `
                <td>${medId}</td>
                <td>${medName}</td>
                <td style="color:${color}; font-weight:800;">${qty}</td>
            `;
            stockList.appendChild(tr);
        }
    });
    box.style.display = "block";
}
// updateDashboardStock(); call at very bottom 
function updateDashboardStock() {
    let medRows = document.querySelectorAll(".medicine tbody tr");
    let count = 0;
    medRows.forEach(row => {
        let qty = parseInt(row.cells[6].textContent) || 0;
        if (qty <= 50) count++;
    });
    document.querySelector(".low-stock h3").textContent = count;
}
/* medicine======================================================================== */
function applyStockStatus() {
    let medRows = document.querySelectorAll(".medicine tbody tr");
    medRows.forEach(row => {
        let qty = parseInt(row.cells[6].textContent) || 0;
        // let statusCell = row.cells[7];
        if (qty <= 20) {
            // statusCell.textContent = "Expired";
            // statusCell.style.color = "red";
            row.cells[6].style.color = "red";   // qty column color
        } 
        else if (qty <= 50) {
            // statusCell.textContent = "Soon";
            // statusCell.style.color = "orange";
            row.cells[6].style.color = "orange"; // qty column color
        } 
        else {
            // statusCell.textContent = "Safe";
            // statusCell.style.color = "green";
            row.cells[6].style.color = "green";
        }
    });
}
// edit button
function editMedicine(btn) {
    let row = btn.parentNode.parentNode;
    let sellCell = row.cells[5];

    let currentValue = sellCell.textContent;

    // replace with input
    sellCell.innerHTML = `<input type="number" value="${currentValue}" style="width:80px;">`;

    btn.textContent = "Save";
    btn.onclick = function () {
        let newValue = sellCell.children[0].value;

        sellCell.textContent = newValue;

        updateMedDropdown(); // optional refresh
        loadMed();

        btn.textContent = "Edit";
        btn.onclick = function () {
            editMedicine(btn);
        };
    };
}

// when delete clicked
function updateMedDropdown() {
    let selects = document.querySelectorAll(".medId");

    selects.forEach(select => {
        select.innerHTML = "<option value=''>Select</option>";

        let medRows = document.querySelectorAll(".medicine tbody tr");

        medRows.forEach(row => {
            let id = row.cells[0].textContent.trim();

            let opt = document.createElement("option");
            opt.value = id;
            opt.textContent = id;

            select.appendChild(opt);
        });
    });
}

document.querySelector(".medicine table tbody").addEventListener("click", function(e) {

    // DELETE BUTTON
    if (e.target.classList.contains("delete")) {
        let confirmDelete = confirm("Do you want to delete this medicine?");
        if (confirmDelete) {
            e.target.closest("tr").remove();
            refreshSystem();
        }
    }

    // EDIT BUTTON
    if (e.target.classList.contains("edit")) {
        let row = e.target.closest("tr");

        let sellPriceCell = row.cells[5]; // sell price column
        let oldValue = sellPriceCell.textContent;

        let newPrice = prompt("Edit Sell Price:", oldValue);

        if (newPrice !== null && newPrice !== "") {
            sellPriceCell.textContent = newPrice;
            refreshSystem();
            applyExpiryColor(row.cells[7]);
        }
    }
});
/* inventory ======================================================================================*/
function openSection(section){
    let history = document.getElementById("stockHistoryBox");
    let purchase = document.getElementById("stockPurchaseBox");
    // -------- HISTORY CLICK ----------
    if(section === "history"){
        // if purchase is open → confirm
        if(!purchase.classList.contains("hidden")){
            let confirmSwitch = confirm("⚠️ Purchase is in progress. Switch anyway?");
            if(!confirmSwitch) return;
        }
        purchase.classList.add("hidden");
        history.classList.remove("hidden");
    }
    // -------- PURCHASE CLICK ----------
    else if(section === "purchase"){
        // if already open → confirm close
        if(!purchase.classList.contains("hidden")){
            let confirmClose = confirm("⚠️ Exit purchase?");
            if(confirmClose){
                purchase.classList.add("hidden");
            }
            return;
        }
        history.classList.add("hidden");
        purchase.classList.remove("hidden");
    }
}
// Show Add Medicine Form
document.querySelector(".add_med_button").addEventListener("click", () => {
    document.querySelector(".add_medicine").classList.remove("hidden");
});
// Cancel form with confirmation
document.querySelector(".cancel").addEventListener("click", () => {
    let confirmCancel = confirm("Do you want to cancel?");

    if (confirmCancel) {document.querySelector(".add_medicine").classList.add("hidden");}
});
// Handle Add Medicine Form Submit
document.querySelector(".add_medicine form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get values
    let medId = document.getElementById("med_id").value;
    let medName = document.getElementById("med_name").value;
    let qty = document.getElementById("quantity").value;
    let cost = document.getElementById("cost_price").value;
    let sell = document.getElementById("sell_price").value;
    let expiry = document.getElementById("expiry_date").value;
    let category = document.getElementById("category").value;
    let company = document.getElementById("company_name").value;

    let expiryStatus = getExpiryStatus(expiry);
    // 1. Add to Medicine Table
    let medTable = document.querySelector(".medicine table tbody");

    let newRow1 = medTable.insertRow();
    newRow1.innerHTML = `
        <td>${medId}</td>
        <td>${company}</td>
        <td>${medName}</td>
        <td>${category}</td>
        <td>${cost}</td>
        <td>${sell}</td>
        <td>${qty}</td>
        <td style=" font-weight:800;">${expiryStatus}</td>
        <td>
            <button class="edit">edit</button>
            <button class="delete">delete</button>
        </td>
    `;
    applyExpiryColor(newRow1.cells[7]);
    // 2. Add to Stock History Table

    let stockTable = document.querySelector(".stock-history table tbody");

    today = new Date().toISOString().split("T")[0];
    if (!medId || !medName || !qty) {
    alert("Please fill all required fields!");
    return;
    }
    let newRow2 = stockTable.insertRow();

    newRow2.innerHTML = `
        <td>${medId}</td>
        <td>${company}</td>
        <td>${medName}</td>
        <td>${category}</td>
        <td>${qty}</td>
        <td>${today}</td>
        <td>${expiry}</td>
        <td>${"N/A"}</td>
    `;
    
    // Reset Form + Hide

    this.reset();
    document.querySelector(".add_medicine").classList.add("hidden");

    alert("Medicine Added Successfully!");
    refreshSystem();
});

// stock purchase----------------------
document.getElementById("savePurchase").addEventListener("click", function () {
    let rows = document.querySelectorAll("#purchaseBody tr");
    let supplierId = document.getElementById("supplierId").value;

    let medTable = document.querySelector(".medicine tbody");
    let stockTable = document.querySelector(".stock-history tbody");

    let today = new Date().toISOString().split("T")[0];

    rows.forEach(row => {
        let medId = row.cells[0].querySelector("input").value;
        let name = row.cells[1].querySelector("input").value;
        let company = row.cells[2].querySelector("input").value;
        let category = row.cells[3].querySelector("select").value;
        let expiry = row.cells[4].querySelector("input").value;
        let price = row.cells[5].querySelector("input").value;
        let qty = parseInt(row.cells[6].querySelector("input").value) || 0;
        if (!medId || !name || qty <= 0) return;
        // 1. ADD TO STOCK HISTORY
        let newRow = stockTable.insertRow();
        newRow.innerHTML = `
            <td>${medId}</td>
            <td>${company}</td>
            <td>${name}</td>
            <td>${category}</td>
            <td>${qty}</td>
            <td>${today}</td>
            <td>${expiry}</td>
            <td>${supplierId}</td>
        `;
        // 2. CHECK IF MED EXISTS
        let found = false;
        let medRows = document.querySelectorAll(".medicine tbody tr");

        medRows.forEach(medRow => {
            let existingId = medRow.cells[0].textContent.trim();
            if (existingId === medId) {
                found = true;
                let currentQty = parseInt(medRow.cells[6].textContent) || 0;
                let newQty = currentQty + qty;
                medRow.cells[6].textContent = newQty;
                // UPDATE EXPIRY STATUS
                let status = getExpiryStatus(expiry);
                medRow.cells[7].textContent = status;
                applyStockStyle(medRow, newQty);
                applyExpiryColor(medRow.cells[7]); 
            }
        });
        // 3. IF NOT FOUND → ADD NEW
        if (!found) {
            let newRowMed = medTable.insertRow();
            let status = getExpiryStatus(expiry);
            newRowMed.innerHTML = `
                <td>${medId}</td>
                <td>${company}</td>
                <td>${name}</td>
                <td>${category}</td>
                <td>${price}</td>
                <td>0</td>
                <td>${qty}</td>
                <td style=" font-weight:800;">${status}</td>
                <td>
                    <button class="edit">edit</button>
                    <button class="delete">delete</button>
                </td>
            `;
            applyExpiryColor(newRowMed.cells[7]);
            applyStockStyle(newRowMed, qty);  /* definition present at the start */
        }
    });
    alert("Purchase Saved & Stock Updated!");
    refreshSystem();
});

/////////////

let suppliersTab = document.querySelector(".supplier table")
function loadSuppliers() {
    let select = document.getElementById("supplierId");
    let suppliersTab = document.querySelector(".supplier tbody");
    select.innerHTML = "<option value=''>Select</option>";
    let rows = suppliersTab.querySelectorAll("tr");
    rows.forEach(row => {
        let id = row.cells[0].textContent.trim();
        let name = row.cells[1].textContent.trim();
        let opt = document.createElement("option");
        opt.value = id;
        opt.textContent = `${id} - ${name}`;
        select.appendChild(opt);
    });
}

// Auto fill supplier name
function fillSupplierName(){
    let id = document.getElementById("supplierId").value;
    for (let i = 1; i < suppliersTab.rows.length; i++) {
        if(id === suppliersTab.rows[i].cells[0].textContent){
            document.getElementById("supplierName").value = suppliersTab.rows[i].cells[1].textContent
        }
    }
}
// ----------- ADD ROW FUNCTION ----------
document.getElementById("addRowPurchase").onclick = function(){
    let table = document.getElementById("purchaseBody");
    let row = table.insertRow();

    row.innerHTML = `
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>

        <td>
            <select>
                <option>Tablet</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Granules</option>
            </select>
        </td>

        <td><input type="date" class="expiry" oninput="calculateRow(this)"></td>
        <td><input type="number" class="price" oninput="calculateRow(this)"></td>
        <td><input type="number" class="qty" oninput="calculateRow(this)"></td>
        <td><input type="number" class="total" readonly></td>

        <td><button class="remove" onclick="removeRow(this)">X</button></td>
    `;

    document.getElementById("purchaseBody").appendChild(row);
};


// ----------- REMOVE ROW ----------
function removeRow(btn){        /* inventory */
    btn.parentElement.parentElement.remove();
    calculateSummary();
}

// ----------- CALCULATE ROW ----------
function calculateRow(el){
    let row = el.parentElement.parentElement;

    let price = row.querySelector(".price").value || 0;
    let qty = row.querySelector(".qty").value || 0;
    let gst = parseFloat(document.getElementById("gstGlobal").value) || 0;

    let total = price * qty;
    row.querySelector(".total").value = total;
    calculateSummary();
}

// ----------- CALCULATE SUMMARY ----------
function calculateSummary(){
    let rows = document.querySelectorAll("#purchaseBody tr");

    let sub = 0;
    rows.forEach(row=>{
        let price = row.querySelector(".price").value || 0;
        let qty = row.querySelector(".qty").value || 0;
        let total = price * qty;
        sub += total;
    });
    let gst = parseFloat(document.getElementById("gstGlobal").value) || 0;
    let gstAmt = (sub * gst)/100;
    
    document.getElementById("subTotal").innerText = sub.toFixed(2)+" rs.";
    document.getElementById("gstTotal").innerText = gstAmt.toFixed(2)+" rs.";
    document.getElementById("grandTotal").innerText = (sub + gstAmt).toFixed(2)+" rs.";
}

// ----------- BUTTON ACTIONS ----------
document.getElementById("clearPurchase").onclick = function(){
    document.getElementById("purchaseBody").innerHTML = "";
    calculateSummary();
};
/*  🙅‍♀️ dont remove these 4/6 lines..........*/
// document.getElementById("savePurchase").onclick = function(){
//     alert("Purchase Saved!");
// };

// document.getElementById("payPurchase").onclick = function(){
//     alert("Payment Done!");
// };

// INIT
loadSuppliers();

/* billing and report =================================================================================== */
document.getElementById("add").addEventListener("click", addItem);
function addItem() {
    let table = document.querySelector(".medicine-table");
    let row = table.insertRow(-1);   // last me row add karega
    
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8);
    
    cell1.innerHTML = '<select class="medId" onchange="fillMedDetail(this)"><select>';
    cell2.innerHTML = '<input type="text">';
    cell3.innerHTML = '<input type="text">';
    cell4.innerHTML = '<input type="text">';
    cell5.innerHTML = '<input type="number" class="qty">';
    cell6.innerHTML = '<input type="number" class="price">';
    cell7.innerHTML = '<input type="number" class="GST">';
    cell8.innerHTML = '0';
    cell8.classList.add("total");
    cell9.innerHTML = '<button class="remove" onclick="removeBillRow(this)">Remove</button>';
    loadMed();
};
function removeBillRow(btn) {     /* billing */
    let row = btn.parentNode.parentNode;
    row.remove();
}
// loadMed() calls at line 815
function loadMed() {
    let selects = document.querySelectorAll(".medId");
    let MedTab = document.querySelector(".medicine table");

    selects.forEach(select => {
        let selectedValue = select.value; // ✅ store old value

        select.innerHTML = "<option value=''>Select</option>";

        for (let i = 1; i < MedTab.rows.length; i++) {
            let id = MedTab.rows[i].cells[0].textContent.trim();

            let opt = document.createElement("option");
            opt.value = id;
            opt.textContent = id;

            // ✅ restore selection
            if (id === selectedValue) {
                opt.selected = true;
            }

            select.appendChild(opt);
        }
    });
}
// // auto fill med name company name
function fillMedDetail(selectEl) {
    let id = selectEl.value;
    let row = selectEl.closest("tr");
    let MedTab = document.querySelector(".medicine table");

    for (let i = 1; i < MedTab.rows.length; i++) {
        if (id === MedTab.rows[i].cells[0].textContent.trim()) {
            row.cells[1].children[0].value = MedTab.rows[i].cells[1].textContent.trim();
            row.cells[2].children[0].value = MedTab.rows[i].cells[2].textContent.trim();
            row.cells[3].children[0].value = MedTab.rows[i].cells[3].textContent.trim();
            row.cells[5].children[0].value = MedTab.rows[i].cells[5].textContent.trim();
        }
    }
}
//calculte bill-------------------------------

// document.addEventListener("click", function(e) {
    
//     if (e.target && e.target.id === "calbil") {
document.getElementById("calbil").addEventListener("click",function(){        
    let rows = document.querySelectorAll(".medicine-table tr");    
    let subtotal = 0;
    let gstTotal = 0;
    let discountPercent = parseFloat(document.getElementById("discountInput").value) || 0;
    rows.forEach((row, index) => {
        if (index === 0) return;    
        let qty = parseFloat(row.querySelector(".qty")?.value) || 0;
        let price = parseFloat(row.querySelector(".price")?.value) || 0;
        let gst = parseFloat(row.querySelector(".GST")?.value) || 0;            
        let base = qty * price;
        let discountAmount=(base*discountPercent)/100;
        let amountAfterDiscount=base-discountAmount;
        let gstAmount = (amountAfterDiscount * gst) / 100;
        let total = amountAfterDiscount + gstAmount;    
        subtotal += base;
        gstTotal += gstAmount;
        row.querySelector(".total").textContent=total.toFixed(2);
    });
    //  Payment summary update in discount
    document.getElementById("subtotal").textContent=subtotal.toFixed(2)+" rs."
    document.getElementById("total").textContent=gstTotal.toFixed(2)+" rs.";
    document.getElementById("Discount").textContent = ((subtotal*discountPercent)/100).toFixed(2) + " rs.";
    
    let grandTotal = subtotal - (subtotal*discountPercent)/100 + gstTotal;
    document.getElementById("grandT").textContent = grandTotal.toFixed(2) + " rs.";
});
// print
document.getElementById("print").addEventListener("click", function () {
    window.print();
});
// save bill-----------------------------------------------------------------------------------        
document.getElementById("save").addEventListener("click", function(){
    updateStock();
    saveBill();
});
function updateStock() {
    let billingRows = document.querySelectorAll(".medicine-table tr");
    let medRows = document.querySelectorAll(".medicine tbody tr");
    billingRows.forEach((row, index) => {
        if (index === 0) return; // skip header
        let medId = row.cells[0].querySelector("select")?.value;
        let qtySold = parseInt(row.cells[4].querySelector("input")?.value) || 0;
        if (!medId || qtySold <= 0) return;
        // Find matching medicine row
        medRows.forEach(medRow => {
            let tableMedId = medRow.cells[0].textContent.trim();
            if (medId === tableMedId) {
                let qtyCell = medRow.cells[6];
                let currentQty = parseInt(qtyCell.textContent) || 0;
                if (currentQty >= qtySold) {
                    let newQty = currentQty - qtySold;
                    qtyCell.textContent = newQty;
                    // ✅ Update stock status (like expiry)
                    // let statusCell = medRow.cells[6];
                    // if (newQty <= 20) {                       
                    //     statusCell.style.color = "red";
                    // } else if (newQty <= 50) {
                    //     statusCell.style.color = "orange";
                    // } else {
                    //     statusCell.style.color = "green";
                    // }
                } else {
                    alert(`Not enough stock for Med ID: ${medId}`);
                }
            }
        });
    });
    refreshSystem();
}
function saveBill() {
    //  Customer Details
    let cname = document.getElementById("cname").value;
    let phone = document.getElementById("cphone").value;
    let date = document.getElementById("cdate").value;
    //  Table Data
    let table = document.querySelector(".medicine-table");
    let items = [];
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let id = row.cells[0].children[0].value;
        let com = row.cells[1].children[0].value;
        let name = row.cells[2].children[0].value;
        let cat = row.cells[3].children[0].value;
        let qty = row.cells[4].children[0].value;
        let price = row.cells[5].children[0].value;
        let gst = row.cells[6].children[0].value;
        let total = row.cells[7].innerText;
        if (name !== "") {
            items.push({
                medicineId: id,
                company: com,
                medicine: name,
                category: cat,
                quantity: qty,
                price: price,
                gst: gst,
                total: total
            });
        }
    }
        //  Payment Summary
    let subtotal = document.getElementById("subtotal").innerText;
    let discount = document.getElementById("Discount").innerText;
    let gstTotal = document.getElementById("total").innerText;
    let grandTotal = document.getElementById("grandT").innerText;    
    //  Final Bill Object
    let bill = {
        customer: {
            name: cname,
            phone: phone,
            date: date,
        },
        items: items,
        payment: {
            subtotal: subtotal,
            discount: discount,
            gstTotal: gstTotal,
            grandTotal: grandTotal
        }
    };

    //  Save in localStorage
    let allBills = JSON.parse(localStorage.getItem("bills")) || [];
    allBills.push(bill);    
    localStorage.setItem("bills", JSON.stringify(allBills));   
    alert(" Bill Saved Successfully!");
    applyStockStyle(newRowMed, qty);
    refreshSystem();
}
//clear------------------------
document.getElementById("clear").addEventListener("click", clearBill);
function clearBill() {    
    //  Customer details clear
    document.getElementById("cname").value = "";
    document.getElementById("cphone").value = "";
    document.getElementById("cdate").value = "";    
    //  Table reset (sirf 1 row chhodkar baaki delete)
    let table = document.querySelector(".medicine-table");    
    while (table.rows.length > 2) {table.deleteRow(1);}  
    //  First row inputs clear
    let firstRow = table.rows[1];
    firstRow.cells[0].children[0].value = "";
    firstRow.cells[1].children[0].value = "";
    firstRow.cells[2].children[0].value = "";
    firstRow.cells[3].children[0].value = "";
    firstRow.cells[4].children[0].value = "";
    firstRow.cells[5].children[0].value = "";
    firstRow.cells[6].children[0].value = "";
    firstRow.cells[7].innerText = "0";    
    //  Payment summary reset
    document.getElementById("subtotal").innerText = "0.00 rs.";
    document.getElementById("Discount").innerText = "0.00 rs.";
    document.getElementById("total").innerText = "0.00 rs.";  // (ya gst Total agar change kiya ho)
    document.getElementById("grandT").innerText = "0.00 rs.";    
    //  Discount input clear
    document.getElementById("discountInput").value = "";
    alert(" Cleared Successfully!");
}
// discount----------------
document.getElementById("discountInput").addEventListener("input", applyDiscount);

function applyDiscount() {
    let subtotal = parseFloat(document.getElementById("subtotal").innerText) || 0;
    let gstTotal = parseFloat(document.getElementById("total").innerText) || 0;
    let discountPercent = parseFloat(document.getElementById("discountInput").value) || 0;
    let discountAmount = (subtotal * discountPercent)/100;
    //  Discount show karo
    document.getElementById("Discount").innerText = discountAmount.toFixed(2) + " rs.";    
    //  Grand Total update
    let grandTotal = subtotal + gstTotal - discountAmount;
    document.getElementById("grandT").innerText = grandTotal.toFixed(2) + " rs.";
}

/* ====================================================supplier =============================================== */
document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('.supplier tbody');
    const popup = document.querySelector('.add-supplier-form');
    const addBtn = document.querySelector('.add-supplier-btn');
    const form = popup.querySelector('form');
    const cancelBtn = popup.querySelector('.s-cancel');
    const okBtn = popup.querySelector('.s-ok');

     loadSuppliers();
    //  OPEN POPUP (ADD)
    addBtn.addEventListener('click', () => {
        popup.style.display = 'block';
        form.reset();
    });
    //  CANCEL BUTTON
    cancelBtn.addEventListener('click', () => {
        let confirmCancel = confirm("Do you want to cancel?");
        if (confirmCancel) {
        popup.style.display = 'none';
        form.reset();
     }
    });
    //  DELETE
    tableBody.addEventListener('click', (e) => {
        // DELETE
        if (e.target.classList.contains('delete')) {
            let confirmCancel = confirm("Do you want to cancel?");
            if (confirmCancel) {
                e.target.closest('tr').remove();
                loadSuppliers();
            }
        }
    });
    //  OK BUTTON ( ADD)
    okBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = document.getElementById('supplier-id').value;
        const name = document.getElementById('supplier-name').value;
        const contact = document.getElementById('s-contact').value;
        const email = document.getElementById('s-email').value;
        const address = document.getElementById('s-address').value;
        const pincode = document.getElementById('s-pincode').value;
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>$${id}</td>
            <td>${name}</td>
            <td>${contact}</td>
            <td>${email}</td>
            <td>${address}</td>
            <td>${pincode}</td>
            <td>
                <button class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);
        loadSuppliers();
        
        popup.style.display = 'none';
        form.reset();
    });

});
// ==================================================setting================================================
function togglePassword() {
    let fields = ["old-pass", "new-pass", "confirm-pass"];
    fields.forEach(function(id) {
        let input = document.getElementById(id);
        if (input.type === "password") {input.type = "text";}
        else {input.type = "password";}
    });
}
// PHOTO FUNCTIONS
function uploadPhoto(event) {
    let file = event.target.files[0];
    if (file) {alert("Selected: " + file.name);}
}
function updatePhoto() {alert("Photo Updated Successfully!");} 
function removePhoto() {alert("Photo Removed!");}
// SAVE SETTINGS
function saveSettings() {    alert("Settings Saved!");}
// LOGOUT
function logout() {
    alert("Logged Out!");
    window.location.href = "login.php"; // change if needed
}
document.addEventListener("DOMContentLoaded", function () {
    let darkToggle = document.querySelectorAll('.right input[type="checkbox"]')[0];
    if (darkToggle) {
        darkToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark", this.checked);
        });
    }
});
// ========================================================================================================================
document.addEventListener("DOMContentLoaded", function () {
    updateDashboardStock();applyStockStatus();loadSuppliers();loadMed();applyStockStyle();
});