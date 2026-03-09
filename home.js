function show(Class){
    document.querySelector(".admin-profile").classList.add("hidden");
    document.querySelector(".dashboard").classList.add("hidden");
    document.querySelector(".supplier").classList.add("hidden");
    document.querySelector(".inventory").classList.add("hidden");
    document.querySelector(".medicine").classList.add("hidden");
    document.querySelector("." + Class).classList.remove("hidden");
    
    
}