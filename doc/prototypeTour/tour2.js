	window.onload=init;
var tour={};
tour.dir=0;
tour.node=0;

function createPage(instr)
{
	if(verbose)
	{
		console.log("createPage"+instr);
	}
	var div=document.createElement("div");
	var str="";
	str+='<div class="top" id="feedback">'+instr+'</div>';
	str+='<div class="wrapper">';
	str+='<img id="main" src="" />';
	str+='</div>';
	str+='<div class="bottom">';
	str+='<a href="javascript:go();"><div class="button100">FORWARD</div></a><br>';
	// generate a svg
	str+='<a href="javascript:left();"><div class="button50">LEFT</div></a>';
	str+='<a href="javascript:right();"><div class="button50 rightbutton">RIGHT</div></a>';
	str+'</div>';
	div.innerHTML=str;
	div.classList.add("container");
	document.body.appendChild(div);
}
function right()
{
	tour.dir++;//=(tour.dir+1)%nodes[tour.node].img.length;
	updateView();
	setFeedback(nodes[tour.node].img[tour.dir]+"/"+nodes[tour.node].img.length);
}
function setFeedback(txt)
{
	document.getElementById("feedback").innerHTML=txt;
}
function left()
{
	tour.dir--;//=(tour.dir+nodes[tour.node].img.length-1)%nodes[tour.node].img.length;
	updateView();
}
function setDir(nr)
{
	tour.dir=nr;
	updateView();
}
function loadNode(nr)
{
	tour.node=nr;
	updateView();
}
function updateView()
{
	if(verbose)
	{
		console.log("update view load img "+tour.node+","+[tour.dir]);
		console.log("update view load img "+JSON.stringify(nodes));
		console.log("update view load img "+nodes[tour.node].img[tour.dir]);
	}
	loadMain(nodes[tour.node].img[tour.dir]);
}
function loadMain(img)
{
	document.getElementById("main").src="images/"+img;
}