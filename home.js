/* modules navigation*/
function show(Class){
    document.querySelector(".admin-profile").classList.add("hidden");
    document.querySelector(".dashboard").classList.add("hidden");
    document.querySelector(".medicine").classList.add("hidden");
    document.querySelector(".inventory").classList.add("hidden");
    document.querySelector(".billing").classList.add("hidden");
    document.querySelector(".supplier").classList.add("hidden");
    document.querySelector(".reports").classList.add("hidden");
    // document.querySelector(".setting").classList.add("hidden");
    document.querySelector("." + Class).classList.remove("hidden");
    
    
}

// function show(section){
//     document.querySelectorAll(".section").forEach(el=>{
//         el.classList.add("hidden");
//     });

//     document.querySelector("." + section).classList.remove("hidden");
// }


 

/* sidebar module active style */
document.querySelectorAll(".sidebar div").forEach(btn=>{
    btn.addEventListener("click", function(){

        document.querySelectorAll(".sidebar div").forEach(b=>{
            b.classList.remove("active");
        });

        this.classList.add("active");

    });
});

/* profile */
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

/* inventory ======================================================================================*/
//  stock history and stock purchase  
function show1(section){
    document.querySelector(".stock-history").classList.add("hidden");
    document.querySelector(".stock-purchase").classList.add("hidden");
    document.querySelector("." + section).classList.remove("hidden");

    document.querySelectorAll(".inventory .card1 div").forEach(el=>{
        el.classList.remove("active-box");
    });

    // add active to clicked
    event.currentTarget.classList.add("active-box");
}
// Show Add Medicine Form
document.querySelector(".add_med_button").addEventListener("click", () => {
    document.querySelector(".add_medicine").classList.remove("hidden");
});
// Cancel form with confirmation
document.querySelector(".cancel").addEventListener("click", () => {
    let confirmCancel = confirm("Do you want to cancel?");

    if (confirmCancel) {
        document.querySelector(".add_medicine").classList.add("hidden");
    }
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
    let supplier = document.getElementById("supplier_name").value;

        // Calculate expiry status
    let today = new Date();
    let expDate = new Date(expiry);

    // Difference in days
    let diffTime = expDate - today;
    let diffDays = diffTime / (1000 * 60 * 60 * 24);

    let expiryStatus;

    // Logic:
    // expired → 0 days or less
    // expiring soon → within 30 days
    if (diffDays <= 0) {
        expiryStatus = "Expired";
    } else if (diffDays <= 30) {
        expiryStatus = "Soon";
    } else {
        expiryStatus = "Safe";
    }
    

    // ===============================
    // 1. Add to Medicine Table
    // ===============================
    let medTable = document.querySelector(".medicine table tbody");

    let newRow1 = medTable.insertRow();
    let color = diffDays <= 0 ? "red" : diffDays <= 30 ? "orange" : "green";
   

    newRow1.innerHTML = `
        <td>${medId}</td>
        <td>${company}</td>
        <td>${medName}</td>
        <td>${category}</td>
        <td>${cost}</td>
        <td>${sell}</td>
        <td>${qty}</td>
         <td style="color:${color}; font-weight:bold;">${expiryStatus}</td>
        <td>
            <button class="edit">edit</button>
            <button class="delete">delete</button>
        </td>
    `;

    // ===============================
    // 2. Add to Stock History Table
    // ===============================
    let stockTable = document.querySelector(".stock-history table tbody");

    today = new Date().toISOString().split("T")[0];

    let newRow2 = stockTable.insertRow();

    newRow2.innerHTML = `
        <td>${medId}</td>
        <td>${company}</td>
        <td>${medName}</td>
        <td>${category}</td>
        <td>${qty}</td>
        <td>${today}</td>
        <td>${expiry}</td>
        <td>${supplier || "N/A"}</td>
    `;

    // ===============================
    // Reset Form + Hide
    // ===============================
    this.reset();
    document.querySelector(".add_medicine").classList.add("hidden");

    alert("Medicine Added Successfully!");
    if (!medId || !medName || !qty) {
    alert("Please fill all required fields!");
    return;
}
});


// let curr = "off";
// let elem = document.querySelector(".add_med_button");
// elem.addEventListener("click", ()=>{
//     if(curr === "off"){
//         curr = "on";
//         document.querySelector(".add_medicine").classList.remove("hidden");
//     }else{
//         document.querySelector(".add_medicine").classList.add("hidden");
//     }
// } );

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

    cell1.innerHTML = '<input type="text">';
    cell2.innerHTML = '<input type="number" class="qty">';
    cell3.innerHTML = '<input type="number" class="price">';
    cell4.innerHTML = '<input type="number" class="GST">';
    cell5.innerHTML = '0';
    cell5.classList.add("total");
    
    cell6.innerHTML = '<button class="remove" onclick="removeRow(this)">Remove</button>';

    
    // const btn=document.getElementsByClassName("remove");
    // btn.addEventListener('click',function(){
    // btn.style.backgroundColor='red';
    // btn.style.color='white'
};


function removeRow(btn) {
    

    let row = btn.parentNode.parentNode;
    row.remove();
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

            // let totalCell = row.querySelector(".total");
            // if (totalCell) {
            //     totalCell.textContent = total.toFixed(2);
            // }
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
    let medTableRows = document.querySelectorAll(".medicine table tbody tr");
    billingRows.forEach((row, index) => {
        if (index === 0) return; // skip header
        let medName = row.cells[0].querySelector("input")?.value;
        let qtySold = parseInt(row.cells[1].querySelector("input")?.value) || 0;
        if (!medName || qtySold <= 0) return;

        // Find matching medicine in medicine table
        medTableRows.forEach(medRow => {
            let tableMedName = medRow.cells[2].innerText;
            if (tableMedName.toLowerCase() === medName.toLowerCase()) {
                let currentQty = parseInt(medRow.cells[6].innerText) || 0;
                if (currentQty >= qtySold) {
                    let newQty = currentQty - qtySold;
                    medRow.cells[6].innerText = newQty;

                } else {
                    alert(`Not enough stock for ${medName}`);
                }
            }
        });

    });
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
        let name = row.cells[1].children[0].value;
        let qty = row.cells[2].children[0].value;
        let price = row.cells[3].children[0].value;
        let gst = row.cells[4].children[0].value;
        let total = row.cells[5].innerText;

        if (name !== "") {
            items.push({
                medicineId: id,
                medicine: name,
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
}


//clear-----------------------------------------------------------------------

document.getElementById("clear").addEventListener("click", clearBill);

function clearBill() {

    //  Customer details clear
    document.getElementById("cname").value = "";
    document.getElementById("cphone").value = "";
    document.getElementById("cdate").value = "";

    //  Table reset (sirf 1 row chhodkar baaki delete)
    let table = document.querySelector(".medicine-table");

    while (table.rows.length > 2) {
        table.deleteRow(1);
    }

    //  First row inputs clear
    let firstRow = table.rows[1];
    firstRow.cells[0].children[0].value = "";
    firstRow.cells[1].children[0].value = "";
    firstRow.cells[2].children[0].value = "";
    firstRow.cells[3].children[0].value = "";
    firstRow.cells[4].children[0].value = "";
    firstRow.cells[5].innerText = "0";

    //  Payment summary reset
    document.getElementById("subtotal").innerText = "0.00 rs.";
    document.getElementById("Discount").innerText = "0.00 rs.";
    document.getElementById("total").innerText = "0.00 rs.";  // (ya gst Total agar change kiya ho)
    document.getElementById("grandT").innerText = "0.00 rs.";

    //  Discount input clear
    document.getElementById("discountInput").value = "";

    alert(" Cleared Successfully!");
}


// discount--------------------------------------------------------------------------
document.getElementById("discountInput").addEventListener("input", applyDiscount);

function applyDiscount() {

    let subtotal = parseFloat(document.getElementById("subtotal").innerText) || 0;
    let gstTotal = parseFloat(document.getElementById("total").innerText) || 0;
    let discountPercent = parseFloat(document.getElementById("discountInput").value) || 0;


    let discountAmount = (subtotal * discountAmount)/100;
    //  Discount show karo
    document.getElementById("Discount").innerText = discountAmount.toFixed(2) + " rs.";
    

    //  Grand Total update
    let grandTotal = subtotal + gstTotal - discountAmount;
    document.getElementById("grandT").innerText = grandTotal.toFixed(2) + " rs.";
}



