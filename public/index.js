/*
 *  Index.js
 *  contains client side js to handle ADD, DELETE, and dynamic redirects
 *  Authors: Ryan Kennedy, Tyler Titsworth
 *  Created: 11/20/2018
 */


//=================================================loads events=========================================//

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


//=================================================delete event========================================//

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
        bodyObj["name"] = String(j.target.getAttribute("name"));        //sets up body object with attribute variables from button
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

//=================================================add event===============================================//

/*
 *  formats the input for our POST request
 */
function checkCreate()
{
    var title = document.getElementById('eventTitle').value;
    var time = document.getElementById('eventTime').value;              //gets inputs
    var date = document.getElementById('eventDate').value;
    var repeat = document.querySelector('.postRepeatInput:checked').getAttribute('value');

    if (!title || !time || !date || !repeat){
  		  alert("You must fill in all of the fields!");                   //if any are empty alearts user
        return;
    } 

    timeBack = time.substring(3,5);                                     //formats time 
    time = time.substring(0,2);                                             
    var month = date.substring(5,7);                                    //formats date
    month = parseInt(month) - 1;
    var year = date.substring(0,4);                 
    date = date.substring(8,10);


    urlRequest(title, month, date, year, time, repeat, timeBack);       //sends request
    closeModal();                                                       //closes
}

/*
 *  opens the modal by unhiding elements
 */
function openModal(){
	document.getElementById("addModal").classList.remove('hidden');
	document.getElementById("modalBackdrop").classList.remove('hidden');
}

/*
 *  sends url request
 */
function urlRequest(title, month, date, year, time, repeat, timeBack){
	var request = new XMLHttpRequest();
	var requestUrl = '/event/' + month + '/' + date + '/' + year + '/' + time;      //set url
	request.open('POST', requestUrl);                                               
	var bodyObj = {
        "name": title,                                                              //sets up body
        "repeat": repeat,
        "timeBack": timeBack
	};
	var body = JSON.stringify(bodyObj);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load', function(event){
        if(!event.target.status == 200){alert('bad');}
        else{
            confirm('Event Added!!!');                                              //reloads on success
            location.reload();
        }
	});
	request.send(body);                                                             //send
}

/*
 *  closes modal by hiding the elements, also resets our form
 */
function closeModal() 
{
	//reset all the inputs
	eventTitle.value = '';
	eventTime.value = '';
	eventDate.value = '';
	//add div to hidden
	document.getElementById("modalBackdrop").classList.add("hidden");
	document.getElementById("addModal").classList.add("hidden");
}


//======================================== Button setup =============================================//
var addButton = document.querySelector(".addButton");
if(addButton){addButton.addEventListener('click', openModal);}
					 
var addAccept = document.querySelector('.actionButton');
if(addAccept){addAccept.addEventListener('click', checkCreate);}

var addCancel = document.querySelector(".modal-cancel-button");
if(addCancel){
    if(addCancel.length){
        for(var i = 0; i < addCancel.length; i ++){
            addCancel[i].addEventListener('click', closeModal);
        }
    }else{
        addCancel.addEventListener('click', closeModal);
    }
}
var addHide = document.querySelector(".modal-hide-button");
console.log(addHide);
if(addHide){
    if(addHide.length){
        for(var i = 0; i < addHide.length; i ++){
            addHide[i].addEventListener('click', closeModal);
        }
    }else{
        addHide.addEventListener('click', closeModal);
    }
}

var grids = document.querySelector(".columns");
if(grids){grids.addEventListener('click', startSend);}

var deleteButton = document.querySelector(".deleteButton");
if(deleteButton){deleteButton.addEventListener('click', deleteElem);}