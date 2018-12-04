The Computer Science & Electrical and Computer Engineering TAs Introduce

## My Cloud Calendar (Name may be changed)

This readme will introduce:
*	What this project is, The overall goal of this project
*	The innerworkings and how-to of the project
*	How to add to the project
*	The target audience of the project
*	The current goal of the project

## The Project Description

[Project Requirements](https://docs.google.com/document/d/1dMv_TcO9pJf3KbpkMrkhCeSZ0pWolj0t0k_uR6e-ufs/edit#)

*HTML 5 Doctype*:
The front end of the project should make use of the HTML5 tags, creating a beautiful front-end for the website.
The website will include:
*   A colored Header
*   A Website Title
*   A nav-list dictating months of the year
*   A simple Main/Body which includes:
   *   A Form for indicating an event's details and an update button
   *   A flex-box object which displays the seven days of the week in collumns
   *   The Collumns should include colored blocks which dictate events
   *   The flex-box object should have rows dictating hours in the day
*   A Footer which includes the Team members and CS290

*CSS3 Styles*
The calendar object sitting as a flex box centered in the main body should be a flex-box that shrinks with
the browser. The style sheets should also include fancy colors and rounded boxed instead of outlined black
ickyness.

*Client-Side JS*
The forms should be controlled with client-side Javascript. The code on the client should control the format
of the data sent to the server. This means that it designates the format of details for each event. The client
should also have adequate warnings for incorrect inputs of information. The details of the forms and possible
issues are posted [here](#Calendar_Form)

The client side JS also has to create all the "div" objects that will be placed within the user's calendar. This
information should be read from the server. This should occur on load within the browser.

*Server in Node-JS* (Subject to Change Due to unknown functionality of server-side code)
The server should both parse the information of events taken in from the client. The Server should also reveal
past input events from the user. This feature should work in tandem to the client-side javascript. When the browser
opens client side, the server must send the initial events from past sessions. The node-js also dictats communication
to MongoDB. This should work to efficiently store and access the events created by the client.

*MongoDB*
The chosen type of NoSQL for storing information in between sessions on the server. Some scripts may need to be
created to prevent server side penetration. If the server goes down, let's make sure the potential customer's
information does not go with it.

## How to use My Calendar

[link to website](#http://calendar.mine.bz/)

The files should include a index.html and any other necessary process to set up the service

## Calendar_Form
The calendar form represents the Mogal the user inputs details about a new event to be created.
At the bare minimum each event requires:
*   A Name for the Event
*   A Location for the Event
*   A Starting time...
*   An Ending time...
*   *Note Time of event must not be illegal, or might span over multiple days*

*   Any other Notes for the event
*   *An optional stretch goal would be to add repetitions, but that is not required for the first version*


## How to add to the project
To avoid merge issues please use your own branches alongside
github pull requests to add changes to the project.

To install current node modules to work on local machine, use:
npm install

--*How-To*--
In shell/terminal navigate to location of git repository.
git status        --> Reveals the current state of the repo

*Make sure to pull before branching, as this will make merging easier*  
  
git branch          --> Lists the current branches within the local repo  
git branch -a       --> Lists remote branches as well  
git branch *name*   --> Creates a new branch of such name  
git checkout *name* --> Will checkout the branch *Note the name of the master branch*  
git branch -h       --> Reveals all erroneous commands for working with branches  
git checkout -h     --> Reveals all erroneous commands for checking out branches  

[More on Branching](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

## How the project works
Check on ##Calendar_Form

**Browser Based**

## The audience of the project

Any individual with a need for organization.
Computer Science 290 Web Development Fall 2018 Class

## The goal of the project

A working block calendar with little to no user error in the most secure and efficient code.
