window.onload=init;
var tour={};
tour.dir=0;
tour.node=0;

function createPage(instr)
{
	console.log("createPage"+instr);
	var div=document.createElement("div");
	var str="";
	str+='<div class="top">'+instr+'</div>';
	str+='<div class="wrapper">';
	str+='<img id="main" src="" />';
	str+='</div>';
	str+='<div class="bottom">';
	str+'</div>';
	div.innerHTML=str;
	div.classList.add("container");
	document.body.appendChild(div);
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
	loadMain(nodes[tour.node].img[tour.dir]);
}
function loadMain(img)
{
	document.getElementById("main").src="images/"+img;
}