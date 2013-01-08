// JavaScript Document - Provides functionality for the imageReel
// Authored by Josh Fixelle

// Declare the slide show frame time in milliseconds
var slideTime = 5000;

// Declare a variable for the images
var images;

// Declare a variable for the captions
var captions;

// Declare a variable to house the table
var table;

// Declare a variable to house the rows and cells
var row = new Array(2);
var topCells;
var lowerCells;

// Declare a variable for the active image
var activeImage;

// Declar a slideshow variable
var slideShow;

// Declare the loader function
function LoadXMLIR(url)
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
function LoadDataIR(url)
{
	// Load the XML file and then pull out the image data
	xmlDoc = LoadXMLIR(url);
	imageData = xmlDoc.getElementsByTagName("image");

	// Allocate the array to hold the images
	images = new Array(imageData.length);
	captions = new Array(imageData.length);

	// Assign the path attribute for the images to the image array
	for ( i = 0; i < imageData.length; i++)
	{
		images[i] = imageData[i].getAttribute("path");
		captions[i] = imageData[i].getAttribute("caption");
	} 
	
	BuildTheTable();

 }
 
 function BuildTheTable()
 {
 
	// set slideshow to false
	slideShow = false;
	
	// get the table object
	table = document.getElementById("imageTable");
	
	// insert rows for the table
	row[0] = table.insertRow(0);
	row[1] = table.insertRow(1);

	// declare a cell for the top row
	topCells = row[0].insertCell(0);

	// populate the top cell with the image and the navbar
	topCells.innerHTML = "<span style=\"position: relative;\"><a id=\"mainHref\" href=" + images[0] + " target=\"_blank\" ><img id=\"mainImage\" class='viewportP' alt=\"img\" src=" + images[0] + " /></a>" 
	+ "<div id=\"outerDiv\"  class='exteriorDiv'>"
	+ "<div  id=\"captionDiv\" style=\"visibility:hidden;overflow: auto; \">"
	+ "<p id=\"caption\" class='captionBox'>"
	+ captions[0]
	+ "</p>"
	+ "</div>"
	+ "</div>"
	+ "<div class='menuDiv' onmouseover=\"ShowDiv('div2hide')\" onmouseout=\"HideDiv('div2hide')\">"
	+ "<div  id=\"div2hide\" style=\"visibility:hidden;\">"
	+ "<ul>"
	+ "<li style=\"display:inline;\"><img id=\"back\" alt=\"back\" title=\"Back One Image\" src=\"Assets/imageviewer_back.png\" width=\"40\" height=\"40\" style=\"opacity:0.4;filter:alpha(opacity=40);\" onclick=\"NavClick('back')\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"this.style.opacity=0.4;this.filters.alpha.opacity=40\"/></li>"
	/*+ "<li style=\"display:inline;\"><img id=\"array\" alt=\"array\" title=\"Toggle Filmstrip Visibility\" src=\"Assets/imageviewer_array.png\" width=\"40\" height=\"40\" style=\"opacity:0.4;filter:alpha(opacity=40);\" onclick=\"NavClick('array')\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"this.style.opacity=0.4;this.filters.alpha.opacity=40\"/></li>"*/
	+ "<li style=\"display:inline;\"><img id=\"playpause\" alt=\"playpause\" title=\"Toggle Play of SlideShow\" src=\"Assets/imageviewer_play.png\" width=\"40\" height=\"40\" style=\"opacity:0.4;filter:alpha(opacity=40);\" onclick=\"NavClick('playpause')\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"this.style.opacity=0.4;this.filters.alpha.opacity=40\"/></li>"
	+ "<li style=\"display:inline;\"><img id=\"caption\" alt=\"caption\" title=\"Toggle Image Caption\" src=\"Assets/imageviewer_caption.png\" width=\"40\" height=\"40\" style=\"opacity:0.4;filter:alpha(opacity=40);\" onclick=\"NavClick('caption')\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"this.style.opacity=0.4;this.filters.alpha.opacity=40\"/></li>"
	+ "<li style=\"display:inline;\"><img id=\"forward\" alt=\"forward\" title=\"Forward One Image\" src=\"Assets/imageviewer_fwd.png\" width=\"40\" height=\"40\" style=\"opacity:0.4;filter:alpha(opacity=40);\" onclick=\"NavClick('fwd')\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"this.style.opacity=0.4;this.filters.alpha.opacity=40\"/></li>"
	+ "</ul>"
	+ "</div>"
	+ "</div></span>";
	
	// allocate the lower cell
	lowerCells = row[0].insertCell(1);

	// populate the lowercell with a horizontally scrolling div
	//innercellString = "<div id=\"strip\" class='filmstrip'>" + "<div style=\"float: top;\">";
	innercellString = "<div id='scrollbarFilm'><div class='scrollbar'><div class='track'><div class='thumb'><div class='end'></div></div></div></div>";
    innercellString = innercellString + "<div align='center' class='viewport'><div align='center' class='overview'>";//<div style=\"float: top;\">";
	// add the images from the xml file
	for (i = 0; i < imageData.length; i++)
	{
		innercellString = innercellString + "<img id=\"trayImage" + i + "\" alt=\"img\" src=" + images[0] + " width=\"107\" height=\"98\" style=\"padding: 5px; background-color: #FFFFFF; opacity:0.4;filter:alpha(opacity=40);\" onmouseover=\"this.style.opacity=1;this.filters.alpha.opacity=100\" onmouseout=\"FilmStripOut(" + i + ")\" onclick=\"ChangeMainImg(" + i + ")\" />";
	}
	innercellString = innercellString + "</div></div></div>";//</div>";
	//innercellString = innercellString + "</div></div>";
	
	lowerCells.innerHTML = innercellString;
	
	// create the scrollbar
	$('#scrollbarFilm').tinyscrollbar();
	
	// update the filmstrip images
	UpdateImages();
	
	// set the viewer to the first image
	ChangeMainImg(0);
 }
 
 function ChangeMainImg(num)
 {
 
	// Assign the active image
	activeImage = num;
	
	// reset the image boarders
	for (i = 0; i < imageData.length; i++)
	{
		document.getElementById("trayImage" + i).style.border = "medium solid #000000";
		document.getElementById("trayImage" + i).style.opacity=0.4;
	}
	
	// change the main image
	document.getElementById("mainImage").src = images[num];
	document.getElementById("mainHref").href = images[num];
	
	// change the caption
	document.getElementById("caption").innerHTML = captions[num];
	
	// change the active image in the film strip
	document.getElementById("trayImage" + num).style.border = "medium solid #FF0000";
	document.getElementById("trayImage" + num).style.opacity=0.75;

	
 }
 
 function FilmStripOut(num)
 {
 
	// allows the mouse out to go back to 75% opacity if the image is the active one
	if (num == activeImage)
	{
		document.getElementById("trayImage" + num).style.opacity=0.75;
	}
	else
	{
		document.getElementById("trayImage" + num).style.opacity=0.4;
	}
 }
 
 function NavClick(id)
 {
	if( id == 'fwd')
	{
		if( activeImage + 1 < images.length )
		{
			activeImage = activeImage + 1;
		}
	}
	else if( id == 'back')
	{
		if( activeImage - 1 >= 0 )
		{
			activeImage = activeImage - 1;
		}
	}
	else if( id == 'array' )
	{
		if( document.getElementById("strip").style.visibility == 'hidden' )
		{
			document.getElementById("strip").style.visibility = 'visible';
			document.getElementById("strip").style.height = "140px";
		}
		else
		{
			document.getElementById("strip").style.visibility = 'hidden';
			document.getElementById("strip").style.height = 0;
			
		}
	}
	else if( id == 'playpause' )
	{
		if( slideShow )
		{
			slideShow = false;
			document.getElementById("playpause").src = "Assets/imageviewer_play.png"
		}
		else
		{
			slideShow = true;
			document.getElementById("playpause").src = "Assets/imageviewer_pause.png"
			PlaySlideShow(activeImage);
		}
	}
	else if( id == 'caption' )
	{
		if( document.getElementById("captionDiv").style.visibility == 'hidden' )
		{
			document.getElementById("captionDiv").style.visibility = 'visible';
			document.getElementById("captionDiv").style.height = "200px";
			document.getElementById("outerDiv").style.height = "200px";
		}
		else
		{
			document.getElementById("captionDiv").style.visibility = 'hidden';
			document.getElementById("captionDiv").style.height = "0px";
			document.getElementById("outerDiv").style.height = "0px";
			
		}		
	}
	
	ChangeMainImg(activeImage);
 }
 function UpdateImages()
 {
	for (i = 0; i < imageData.length; i++)
	{
		document.getElementById("trayImage" + i).style.border = "medium solid #000000";	
		document.getElementById("trayImage" + i).src = images[i];
	}
 }
 
 function PlaySlideShow(newImg)
 {
	if(slideShow && ( activeImage < (images.length - 1) ) )
	{
		ChangeMainImg(newImg);
		setTimeout("PlaySlideShow(activeImage + 1)", slideTime);
	}
	else
	{
		slideShow = false;
		document.getElementById("playpause").src = "Assets/imageviewer_play.png"
	}
 }
 
 function ShowDiv(id)
{
	document.getElementById(id).style.visibility = 'visible';
}

function HideDiv(id)
{
	document.getElementById(id).style.visibility = 'hidden';
}