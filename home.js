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

/* stock history and stock purchase  */
function show1(section){
    document.querySelector(".stock-history").classList.add("hidden");
    document.querySelector(".stock-purchase").classList.add("hidden");
    document.querySelector("." + section).classList.remove("hidden");
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

/* billing and report */
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
    
document.getElementById("save").addEventListener("click", saveBill);

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

        let name = row.cells[0].children[0].value;
        let qty = row.cells[1].children[0].value;
        let price = row.cells[2].children[0].value;
        let gst = row.cells[3].children[0].value;
        let total = row.cells[4].innerText;

        if (name !== "") {
            items.push({
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
    firstRow.cells[4].innerText = "0";

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



