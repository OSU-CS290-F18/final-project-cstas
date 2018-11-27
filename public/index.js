function startSend(j){
    if(j.target.getAttribute('class') == 'grid-box'){ 
        var time = String(j.target.getAttribute("value"));
        var requestUrl = String(document.querySelector(".requestVar").textContent)+ String(j.target.getAttribute('day'))+ '/' + time;
        window.location.href = requestUrl;
    }
}

function deleteElem(j){
    
    if(j.target.getAttribute('class') == 'deleteButton'){ 
        console.log(j.target.getAttribute('name'));
        var request = new XMLHttpRequest();
        var requestUrl = window.location.pathname;
        request.open('DELETE', requestUrl + '/delete');
        request.setRequestHeader('Content-Type', 'application/json');
        var bodyObj = {};
        bodyObj["name"] = String(j.target.getAttribute('name'));
        bodyObj['day'] = String(j.target.getAttribute('day'));
        
        var body = JSON.stringify(bodyObj);
        console.log(body);
        
        request.addEventListener('load', function(event){
            window.location.href = document.referrer;
        });
        request.send(body);
        
        console.log("ran");
        j.stopPropagation();
    }
}

var deleteButton = document.querySelector(".deleteButton");
if(deleteButton){deleteButton.addEventListener('click', deleteElem);}

var grids = document.querySelector(".columns");
if(grids){grids.addEventListener("click", startSend);}