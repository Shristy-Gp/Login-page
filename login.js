function show(Class){
    document.querySelector(".content").classList.add("hidden");
    document.querySelector(".content1").classList.add("hidden");
    document.querySelector("." + Class).classList.remove("hidden");
}