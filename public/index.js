function startSend(j){
    if(j.target.getAttribute('class')){ 
        var time = String(j.target.getAttribute("value"));
        var requestUrl = String(document.querySelector(".requestVar").textContent) + time;
        window.location.href = requestUrl;
    }
}

var grids = document.querySelector(".columns");
grids.addEventListener("click", startSend);