// JavaScript Document - Provides functionality for the main page updates
// Authored by Josh Fixelle

// declare a variable for the updateData
var updates;

// Declare the loader function
function LoadXMLUD(url)
{
	xmlData = false;
	if(window.XMLHttpRequest && !(window.ActiveXObject))
	{
		try
		{
			xmlData = new XMLHttpRequest();
		}
		catch (e)
		{
			xmlData = false;
		}		
	}
	// account for the IE version
	else if(window.ActiveXObject)
	{
		try
		{
			xmlData = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e)
		{
			xmlData = false;
		}
	}
	
	if(xmlData)
	{
		//xmlData.onreadystatechange = processXMLChange;
		xmlData.open("GET", url, false);
		xmlData.send("");
		return xmlData.responseXML;
	}
	

}

// Load the actual Data
function LoadDataUD(url)
{
	// Load the XML file and then pull out the update data
	xmlDoc = LoadXML(url);
	updateData = xmlDoc.getElementsByTagName("update");

	// Allocate the array to hold the updates
	updates = new Array(updateData.length);


	// Assign the path attribute for the images to the image array
	for ( i = 0; i < updateData.length; i++)
	{
		updates[i] = updateData[i].getAttribute("content");
	} 

	// now add the updates
	AddUpdates();
 }
 
 // add in the updates
 function AddUpdates()
 {
	// declare a string value to hold the inner html data
	inData = "";
	
	// for all of the updates, add a paragraph
	for( i = 0; i < updates.length; i++)
	{
		if( updates[i].length == 0 )
			inData = inData + "<br/>";
		else
			inData = inData + "<p class=\"hmintxt\">" + updates[i] + "</p>";
	}

	// add the inner HTML
	document.getElementById("updateDiv").innerHTML = inData;
 }