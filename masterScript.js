// define some classes
function Page()
{
	// variables
	this.m_Name; // the page name
	this.m_Title; // the page title
	this.m_Heading; // page header
	this.m_Content; // page html content
	this.m_SubPages; // subpages
	this.m_CurrentPage; // the current sub page [-1 dontes home] 
}

// some global variables
var pages;
var activePage = -1;
var whitespace = /^\s+$/;
function GetPageIndexById(ii)
{
	for( i = 0; i < pages.length; i++ )
	{
		if( pages[i].m_Name == ii )
		{
			return i;
		}
	}
	 
	return 0;
}
function PreloadImages( images ) 
{
    $(images).each(function()
	{
        //$('<img/>')[0].src = this;
        $(new Image()).src = this;
    }
	);
}
$(document).load( function () 
{
	// preload some images
	PreloadImages([
	'Assets/OuterRim.png',
	'Assets/test-supernova.jpg',
	'Assets/OuterRim.png',
	'Assets/SideBarButton_Flip_over.png',
	'Assets/SideBarButton_Flip.png',
	'Assets/SideBarButton_Flip_Select.png',
	'Assets/SideBarButton_Flip_Select_over.png',
	'Assets/BackDrop1.png',
	'Assets/SubpageBack.png',
	'Assets/Scroll.png'
	]);
});

function ChangePage(ii)
{
	if( activePage != -1 )
	{
		$('#' + pages[activePage].m_Name).removeClass('navBtnSelectOut');
		$('#' + pages[activePage].m_Name).addClass('navBtnOut');
	
		// check to see if active page has subpages
		if( pages[activePage].m_SubPages != null )
		{
			// must unload the sub pages
			$('#' + pages[activePage].m_Name + 'subs').html("");
			$('#' + pages[activePage].m_Name + 'subs').removeClass('subpageOver');
			$('#' + pages[activePage].m_Name + 'subs').addClass('subpageOut');
		}
		
		// setting the home button active from start, we don't want over
		$('#' + pages[ii].m_Name).removeClass('navBtnOver');
		$('#' + pages[ii].m_Name).addClass('navBtnSelectOver');
	}
	
	if( activePage == -1 )
	{
		$('#' + pages[ii].m_Name).removeClass('navBtnOut');
		$('#' + pages[ii].m_Name).addClass('navBtnSelectOut');
	}
	
	activePage = ii;
	document.title = pages[ii].m_Title;
	//$('#' + pages[ii].m_Name).css({color: '#aaaa00'});
	
	$('#pageHead').text(pages[ii].m_Heading);
	
	// check to see if the active pages has any subpages
	if( pages[activePage].m_SubPages != null )
	{
		// load the subpage links
		$('#' + pages[activePage].m_Name + 'subs').removeClass('subpageOut');
		$('#' + pages[activePage].m_Name + 'subs').addClass('subpageOver');
		strt = "<div id='subscroll'><div class='scrollbar'><div class='track'><div class='thumb'><div class='end'></div></div></div></div>";
		strt = strt + "<div align='center' class='viewport'><div align='center' class='overview'>";
		for( i = 0; i < pages[activePage].m_SubPages.length; i++ )
		{
			strt = strt + "<div class='subtext' id='" + pages[activePage].m_Name + i +"' >";
			strt = strt + pages[activePage].m_SubPages[i].m_Name + "</div>";
		}
		strt = strt + "</div></div></div><script type='text/javascript'>$(document).ready(function(){$('#subscroll').tinyscrollbar();});</script>";
		
		$('#' + pages[activePage].m_Name + 'subs').html(strt);
		
		// add the mouse over functionality
		for( i = 0; i < pages[activePage].m_SubPages.length; i++ )
		{
			$('#' + pages[activePage].m_Name + i).bind( 'mouseover', mFootOver );
			$('#' + pages[activePage].m_Name + i).bind( 'mouseout', mFootOut );
			$('#' + pages[activePage].m_Name + i).bind( 'click', mSubClick );
		}
		
		// set the subpage to -1
		pages[activePage].m_CurrentPage = -1; // home
	}
	
	LoadActivePage();
}

var xmlDoc;

// The init function
$(document).ready( function () 
{

	
	// Load the XML file and then pull out the update data
	xmlDoc = LoadXML("mainContent.xml");
	pageData = xmlDoc.getElementsByTagName("page");
	pages = new Array(pageData.length);
	for( i = 0; i < pageData.length; i++ )
	{
		pages[i] = new Page;
		pages[i].m_Name = pageData[i].getAttribute("name");
		pages[i].m_Title = pageData[i].getAttribute("title");
		pages[i].m_Heading = pageData[i].getAttribute("heading");
		pages[i].m_CurrentPage = -1;
		// load the XML children
		if( (pageData[i] == undefined) || (pageData[i].childNodes.length <= 0) )
		{
			// set the html to blank
			strt = "";
		}
		else
		{
			strt = GenerateHTML(pageData[i]);
		}
		pages[i].m_Content = strt;
	
		// look for the home page
		if( pages[i].m_Name == "Home" )
		{
			activePage = i;
		}
		
		// look for subpages
		var subData = pageData[i].getElementsByTagName("subpage");
		if( subData.length == 0 )
		{
			pages[i].m_SubPages = null;
		}
		else
		{
			pages[i].m_SubPages = new Array(subData.length);
			
			// load the subpages
			for( j = 0; j < subData.length; j++ )
			{
				pages[i].m_SubPages[j] = new Page;
				pages[i].m_SubPages[j].m_Name = subData[j].getAttribute("name");
				pages[i].m_SubPages[j].m_SubPages = null;
					
				// load the subpage data
				if( (subData[j] == undefined) || (subData[j].childNodes.length <= 0) )
				{
					// set the html to blank
					strt = "";
				}
				else
				{
					strt = GenerateHTML(subData[j]);
				}
				pages[i].m_SubPages[j].m_Content = strt;
			}
		}
	}
	
	// update the background
	UpdateBackground();
	
	// add the animations
	$('#ContainerObj').html("<div class='outertest'><div class='test2'></div><div id='sideAnim' class='test3'></div></div>");
	// animate the backdrop
	$('#sideAnim')  
        // step 4. move the navigation item down  
        .animate({width:'864px'},1000, ContinueLoading);
	
});


function ContinueLoading()
{
	// add the backdrop
	$('#ContainerObj').addClass('containerPic');
		
	
	// add the menucontainer
	strt = "<table id='contentTable' class='container'><tr><td valign='top' class='navContainer'><div id='menuContainer' class='navContainer'></div></td>";
	strt = strt + "<td valign='top'><div id='contentContainer' class='contentOuter'></div></td>";
	strt = strt + "</tr><tr><td colspan='2'><div id='footerContent' class='footerContainer'></div></td></tr></table>";
	$('#ContainerObj').html(strt);
	
	// display the page info
	strt = "";
	for( i = 0; i < pages.length; i++ )
	{
		strt = strt + "<div id='" + pages[i].m_Name + "' class='btncls'><div class='btntxt'>" + pages[i].m_Name + "</div></div>";
		strt = strt + "<div id='" + pages[i].m_Name + "subs' class='subpageOut'></div>";
	}
	
	$('#menuContainer').html(strt);

	
	// cycle through the pages adding functions
	for( i = 0; i < pages.length; i++ )
	{
		$('#' + pages[i].m_Name).bind( 'mouseover', mMouseOver );
		$('#' + pages[i].m_Name).bind( 'mouseout', mMouseOut );
		$('#' + pages[i].m_Name).bind( 'click', mClick );
		$('#' + pages[i].m_Name).addClass('navBtnOut');
		$('#' + pages[i].m_Name).css({opacity: '0.0'});
	}
	
	// change the page to the active page
	ChangePage(activePage);
	
	// make sure to mouse out of the home button
	$('#' + pages[activePage].m_Name).removeClass('navBtnSelectOver');
	$('#' + pages[activePage].m_Name).addClass('navBtnSelectOut');

	// lets animate the buttons
	loading = 0;
	AnimateButtons();
	
	// animate the background
	$('#contentContainer').animate({width:'630px',height:'540px'},1000, LoadContent);
}
function LoadContent()
{
	// add the heading
	$('#contentContainer').html("<h1 class='heading' id='pageHead'></h1> <div id='innerContent' class='contentClass' ></div>");
	$('#pageHead').css({opacity: '0.0'});
	$('#pageHead').animate({opacity: '1.0'},1000);
		
	// make sure to mouse out of the home button
	$('#' + pages[activePage].m_Name).removeClass('navBtnSelectOver');
	$('#' + pages[activePage].m_Name).addClass('navBtnSelectOut');
	
	
	// lets load the footer info
	footData = xmlDoc.getElementsByTagName("footer");
	
	strt = "";
	for( i = 0; i < footData.length; i++ )
	{
		strt = strt + "<div id='foot" + i + "' class='footText'> " + footData[i].getAttribute("name") + "</div>";
	}
	
	$('#footerContent').html(strt);
	
	for( i = 0; i < footData.length; i++ )
	{
		$('#foot' + i).css({opacity: '0.0'});
		$('#foot' + i).css({left: (parseInt(i*25 , 10))});
		$('#foot' + i).css({top: (parseInt(i*2 , 10))});
		$('#foot' + i).animate({opacity: '1.0'},1000);
		$('#foot' + i).bind( 'mouseover', mFootOver );
		$('#foot' + i).bind( 'mouseout', mFootOut );
	}
	
	// change the page to the active page
	// switch the vars for loading
	ii = activePage;
	activePage = -1;
	ChangePage(ii);
	
}

function LoadActivePage()
{
	// set the page content
	if( pages[activePage].m_SubPages == null )
		$('#innerContent').html(pages[activePage].m_Content);
	else
	{
		if( pages[activePage].m_CurrentPage == -1 )
		{
			$('#innerContent').html(pages[activePage].m_Content);
		}
		else if( (pages[activePage].m_CurrentPage >= 0) && (pages[activePage].m_CurrentPage < pages[activePage].m_SubPages.length) )
		{
			$('#innerContent').html(pages[activePage].m_SubPages[pages[activePage].m_CurrentPage].m_Content);
		}
	}
}
function GenerateHTML(xmlnode)
{

	// check to see if we have children
	if( xmlnode.childNodes.length < 1 )
		return ""; // nothing there
	else if( (xmlnode.childNodes.length == 1) && (xmlnode.childNodes[0].nodeType) == 3 )
		return xmlnode.childNodes[0].nodeValue; // if there are no tags, then the child is text
		
	// get the tags
	var nodes = xmlnode.childNodes;//.getElementsByTagName("*");

	// set an empty HTML string
	var htmlstr = "";
	var i;
	// cycle through the elements
	for( i = 0; i < nodes.length; i++ )
	{
		// get the tag type
		if( nodes[i].nodeType == 1 ) // we have a tag
		{
			// check to see if tag is a subpage, if so, skip
			if(nodes[i].nodeName == "subpage")
				continue;
				
			htmlstr = htmlstr + "<" + nodes[i].nodeName + " ";
			
			
			// check to see if this node has idInfo
			if( nodes[i].getAttribute("id") != null )
				htmlstr = htmlstr + "id='" + nodes[i].getAttribute("id") + "' ";
			
			// check to see if this node has class info
			if( nodes[i].getAttribute("class") != null )
				htmlstr = htmlstr + "class='" + nodes[i].getAttribute("class") + "' ";
			
			// check to see if this node has type info
			if( nodes[i].getAttribute("type") != null )
				htmlstr = htmlstr + "type='" + nodes[i].getAttribute("type") + "' ";
			
			// check to see if this node has an align type info
			if( nodes[i].getAttribute("align") != null )
				htmlstr = htmlstr + "align='" + nodes[i].getAttribute("align") + "' ";
				
			// close the tag
			htmlstr = htmlstr + "> ";
			
			
			// check to see if there are children
			if( nodes[i].childNodes.length > 0 )
			{
				htmlstr = htmlstr + GenerateHTML( nodes[i] );
			}
			
			// close the tag
			htmlstr = htmlstr + "</" + nodes[i].nodeName + ">";
		}
	}
	
	return htmlstr;
}

function mFootOver()
{
	$(this).text( "[ " + $(this).text() + " ]");
}
function mFootOut()
{
	temp = $(this).text();
	temp = temp.replace("[ ","");
	temp = temp.replace(" ]","");
	$(this).text(temp);
}
function mSubOver()
{
	$(this).removeClass("subtext");
	$(this).addClass("subtextOver");
}
function mSubOut()
{
	$(this).removeClass("subtextOver");
	$(this).addClass("subtext");
}
var loading;
function AnimateButtons()
{
	if( loading >= pages.length )
		return;
		
	$('#' + pages[loading].m_Name).animate({opacity: '1.0'}, 500, AnimateButtons );
	loading++;
}
// add variables to hold the window size, and a resize window update function
var winW = 630, winH = 460;
$(document).resize( UpdateBackground );

// function to update the background images to prevent repeating and scrolling.
function UpdateBackground()
{
	// get the new window size
	GetWindowSize();
	
	// update the background div size properties
	$('#OuterContainer').css('height', (parseInt(winH , 10)) + 'px');
	$('#OuterContainer').css('width', (parseInt(winW, 10)) + 'px');
}

// function to get the size of the window
function GetWindowSize()
{
	if (document.body && document.body.offsetWidth) 
	{
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
 	if (document.compatMode=='CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth ) 
	{
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) 
	{
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
}

function mMouseOver(e)
{
	if( GetPageIndexById(this.id) == activePage )
	{
		$(this).removeClass('navBtnSelectOut');
		$(this).addClass('navBtnSelectOver');
	}
	$(this).removeClass('navBtnOut');
	$(this).addClass('navBtnOver');
	
	
}

function mMouseOut(e)
{
	if( GetPageIndexById(this.id) == activePage )
	{
		$(this).removeClass('navBtnSelectOver');
		$(this).addClass('navBtnSelectOut');
	}
	$(this).removeClass('navBtnOver');
	$(this).addClass('navBtnOut');
	
}

function mClick(e)
{
	index = GetPageIndexById(this.id);
	ChangePage(index);
}

function mSubClick(e)
{
	// find the subpage num
	var i;
	for( i = 0; i < pages[activePage].m_SubPages.length; i++ )
	{
		if( this.id == String(pages[activePage].m_Name + i) )
			break;
	}
	
	pages[activePage].m_CurrentPage = i;
	LoadActivePage();
}
// Declare the loader function
function LoadXML(url)
{
	xmlData = false;
	if(window.XMLHttpRequest && !(window.ActiveXObject))
	{
		try
		{
			xmlData = new XMLHttpRequest();
			xmlData.async = false;
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
			xmlData.async = false;
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

