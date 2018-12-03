/*
 *  Index.js
 *  contains client side js to handle ADD, DELETE, and dynamic redirects
 *  Authors: Ryan Kennedy, Tyler Titsworth
 *  Created: 11/20/2018
 */


/* 
 *  Grabs date information from the the clicked target if it is a grid box and redirects the user to the proper event page 
 */
function startSend(j){
    if(j.target.getAttribute('class') == 'grid-box'){ 
        var time = String(j.target.getAttribute("value"));
        var date = String(j.target.getAttribute('date'));                           //grabs vars from the html
        var day = String(j.target.getAttribute('day'));
        var urlBase = String(document.querySelector(".requestVar").textContent);

        var requestUrl = urlBase + date + '/' + time + '/' + day;                   //set up request url
        window.location.href = requestUrl;                                          //redirect user
        j.stopPropagation();
    }
}

/*
 *  Sends DELETE request for an event whos delete button was clicked using metadata from the button 
 */
function deleteElem(j){
    if(j.target.getAttribute('class') == 'deleteButton'){               //if its the delete button
        var request = new XMLHttpRequest();
        var requestUrl = window.location.pathname;                      //creates new request using the page URL
        request.open('DELETE', requestUrl + '/delete');                 //opens the delete request
        request.setRequestHeader('Content-Type', 'application/json');   
        
        var bodyObj = {};
        bodyObj["name"] = String(j.target.getAttribute('name'));        //sets up body object with attribute variables from button
        bodyObj['day'] = String(j.target.getAttribute('day'));
        
        var body = JSON.stringify(bodyObj);                             
        
        request.addEventListener('load', function(event){               
            if(event.target.status === 200){                        
                window.location.href = document.referrer;               //if delete goes through redirects the user to the page they came from      
            }
            else{
                alert('Error, event not deleted');                      //else drops an error
            }
        });
        request.send(body);
        j.stopPropagation();                                            //sends and stops propogation
    }
}

function checkCreate()
{
    var title = document.getElementById('eventTitle').value;
    var time = document.getElementById('eventTime').value;
    var date = document.getElementById('eventDate').value;
    var repeat = document.querySelector('.postRepeatInput:checked').getAttribute('value');

    console.log(title);
    console.log(time);
    console.log(date);
    console.log(repeat);

  	if (!title || !time || !date || !repeat) 
	{
  		alert("You must fill in all of the fields!");
        return;
    } 
   
}

function openModal()
{
	document.getElementById("addModal").classList.remove('hidden');
	document.getElementById("modalBackdrop").classList.remove('hidden');
}

function addEvent()
{
	openModal();
  
    


    urlRequest(title, month, day, year, time)
    
	closeModal();
}

function urlRequest(title, month, day, year, time)
{
	var request = new XMLHttpRequest();
	var requestUrl = '/event/' + month + '/' + day + '/' + year;
	request.open('POST', requestUrl);
	var bodyObj = {
        "title": title,
        "time12": time
	};
	var body = JSON.stringify(bodyObj);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load', function(event){
		if(!event.target.status == 200){alert('bad');}
	});
	request.send(body);
}

function closeModal() 
{
	//reset all the inputs
	document.getElementById("post-title-input").value = "";
	document.getElementById("post-time1-input").value = "";
	document.getElementById("post-time2-input").value = "";
  	var checkrepeat = document.querySelector('#post-repeat-input input[checked]');
 	checkrepeat.checked = true;
	//add div to hidden
	document.getElementById("add-button").classList.add('hidden');
	document.getElementById("modal-backdrop").classList.add('hidden');
}


//======================================== Button setup =============================================//
var addButton = document.querySelector(".addButton");
if(addButton){addButton.addEventListener('click', addEvent);}
					 
var addAccept = document.querySelector('.actionButton');
if(addAccept){addAccept.addEventListener('click', checkCreate);}

var addCancel = document.querySelector(".modal-cancel");
if(addCancel){addCancel.addEventListener('click', closeModal);}

var grids = document.querySelector(".columns");
if(grids){grids.addEventListener('click', startSend);}

var deleteButton = document.querySelector(".deleteButton");
if(deleteButton){deleteButton.addEventListener('click', deleteElem);}

