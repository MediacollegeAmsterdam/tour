window.onload=init;
var tour={};
tour.dir=0;
tour.node=0;
tour.forward=false;
tour.backward=false;

function createPage(instr)
{
	if(verbose)
	{
		console.log("createPage"+instr);
	}
	var div=document.createElement("div");
	var str="";
	str+='<div class="top" id="feedback">'+instr+'</div>';
	str+='<div class="wrapper" id="main">';
	//str+='<img id="main" src="" />';
	str+='</div>';
	str+='<div class="bottom">';
	str+='<a href="javascript:go();"><div id "forward" class="button100">GO</div></a><br>';
	// generate a svg
	str+='<a href="javascript:left();"><div class="button50">LEFT</div></a>';
	str+='<a href="javascript:right();"><div class="button50 rightbutton">RIGHT</div></a>';
	str+='<a href="javascript:goback();"><div id class="button100" "backward" >BACK</div></a><br>';
	str+'</div>';
	div.innerHTML=str;
	div.classList.add("container");
	document.body.appendChild(div);
}
function right()
{
	var old=tour.dir;
	tour.dir=(tour.dir+1)%nodes[tour.node].img.length;
	updateView();
	setFeedback(nodes[tour.node].img[tour.dir]+" "+old+"/"+nodes[tour.node].img.length +"->"+tour.dir+"/"+nodes[tour.node].img.length);
}
function setFeedback(txt)
{
	document.getElementById("feedback").innerHTML=txt;
}
function left()
{
	var old=tour.dir;
	tour.dir=(tour.dir+nodes[tour.node].img.length-1)%nodes[tour.node].img.length;
	updateView();
	setFeedback(nodes[tour.node].img[tour.dir]+" "+old+"/"+nodes[tour.node].img.length +"->"+tour.dir+"/"+nodes[tour.node].img.length);
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
	// check connections!
	tour.forward=-1;
	tour.backward=-1;
	for(var i=0;i<connections.length;i++)
	{
		var c=connections[i];
		if(c[0].dir==tour.dir)
		{
			if(c[0].node==tour.node) tour.forward=c[1].node;
			if(c[1].node==tour.node) tour.backward=c[0].node;
		}
	}
	if(tour.forward!=-1)
	{
		console.log("You can go forward to "+tour.forward);
	}
	if(tour.backward!=-1)
	{
		console.log("You can go backward to "+tour.backward);
	}
}
function go()
{
	if(tour.forward!=-1)
	{
		tour.node=tour.forward;
		updateView();
	}
}
function loadMain(img_src)
{
	var div=document.getElementById("main");
	div.style.backgroundImage = "url(images/"+img_src+")";
	
}
//window.onresize=resizeMain; // this should alsod calc the wrapper, because clientWidth is wrong.
function resizeMain()
{
	var img=document.getElementById("main");
	var factorx=img.clientWidth/window.innerWidth;
	var factory=img.clientHeight/window.innerHeight;
	var factor=factorx;
	if(factory>0.6)
	{
		factory=0.6/factory;
		if(factory<factor)factor=factory;
	}
	var new_width=factor*img.clientWidth;
	var new_height=factor*img.clientHeight;
	img.style.width = new_width+"px";
	img.style.height = new_height+"px";
	var margin=(window.innerWidth-new_width)/2;
	img.style.marginLeft= margin+"px";
}