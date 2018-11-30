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
	var title = document.getElementById('post-title-input').value;
	var time1 = document.getElementById('post-time1-input').value;
  	var time2 = document.getElementById('post-time2-input').value;

  	if (!title || !time1 || !time2) 
	{
  		alert("You must fill in all of the fields!");
  	} 
	else
	{
    		allPosts.push({
      		title: title,
      		time1: time1,
      		time2: time2,
      		repeat: repeat
    		})
	};
	closeModal();
}

function openModal()
{
	document.getElementById("add-button").classList.remove('hidden');
	document.getElementById("modal-backdrop").classList.remove('hidden');
}

function addEvent()
{
	openModal();
	//info for the url.
	var time1 = document.getElementById('post-time1-input').value;
	var time2 = document.getElementById('post-time2-input').value;
  	var repeat = document.querySelector('#post-repeat-input input:checked').value;
	var someMonth = time1.getMonth();
	var someDay = time1.getDate();
	var someYear = time1.getFullYear();
	if(repeat)
	{
		someYear = 0;
		time1.getFullYear() = 0;
	}
	var someTime = time1.getTime();
	var title = document.getElementById('post-title-input').value;
	urlRequest();	
	//creating div for insertion
	var eventDiv = document.createElement('div');
 	eventDiv.classList.add('post');
 	eventDiv.setAttribute('data-title', title);
 	eventDiv.setAttribute('data-time1', time1);
 	eventDiv.setAttribute('data-time2', time2);
 	eventDiv.setAttribute('data-repeat', repeat);
	//Create inner event-contents div and add to event div
	var eventContentsDiv = document.createElement('div');
	eventContentsDiv.classList.add('event-contents');
	eventDiv.appendChild(eventContentsDiv);
	//create post-info-container div and add to post-contents
	var eventInfoContainerDiv = document.createElement('div');
  	eventInfoContainerDiv.classList.add('event-info-container');
	eventContentsDiv.appendChild(eventInfoContainerDiv);
 
  	var eventLink = document.createElement('a');
  	eventLink.classList.add('post-title');
  	eventLink.href = '#';
  	eventLink.textContent = title;
  	eventInfoContainerDiv.appendChild(eventLink);
	
	var spaceText1 = document.createTextNode(' ');
	postInfoContainerDiv.appendChild(spaceText1);

  	var eventtime1span = document.createElement('span');
  	eventtime1span.classList.add('post-time1');
  	eventtime1span.textContent = time1.toString();
  	eventInfoContainerDiv.appendChild(eventtime1span);

	var spaceText2 = document.createTextNode(' ');
	postInfoContainerDiv.appendChild(spaceText2);

	var eventtime2span = document.createElement('span');
  	eventtime2span.classList.add('post-time2');
  	eventtime2span.textContent = time2.toString();
  	eventInfoContainerDiv.appendChild(eventtime2span);
	//add the new post element into DOM
	/*
		Function should align to grid properly, TODO
	*/
	
	closeModal();
}

function urlRequest()
{
	var request = new XMLHttpRequest();
	var requestUrl = '/event/' + someMonth + '/' + someDay + '/' + someYear + '/' + someTime;
	request.open('POST', requestUrl);
	var bodyObj = {
	    title: title,
	    day: someDay
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
					 
var addAccept = document.querySelector('.addAccept');
if(addAccept){addAccept.addEventListener('click', checkCreate);}

var addCancel = document.querySelector(".modal-cancel");
if(addCancel){addCancel.addEventListener('click', closeModal);}

var grids = document.querySelector(".columns");
if(grids){grids.addEventListener('click', startSend);}

var deleteButton = document.querySelector(".deleteButton");
if(deleteButton){deleteButton.addEventListener('click', deleteElem);}

