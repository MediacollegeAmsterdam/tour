window.onload=init;
var tour={};
tour.dir=0;
tour.node=0;
tour.forward=false;
tour.backward=false;
inventory=[];

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
	str+='<img id="item"></img>';
	//str+='<img id="main" src="" />';
	str+='<div class="map" id="inventory"><canvas id="map" width=100 height=120></canvas></div>';
	str+='</div>';
	str+='<div class="bottom">';
	str+='<a href="javascript:go();"><div id="forward" class="button100"><img style="margin: auto; width: 30px; height: 20px;" src="clips/arrow_up.png">FORWARD</div></a><br>';
	// generate a svg
	str+='<a href="javascript:left();"><div class="button50">LEFT <img style="display: block; margin: auto; width: 40px; height: 25px;" src="clips/arrow_left.png"></div></a>';
	str+='<a href="javascript:right();"><div class="button50 rightbutton">RIGHT  <img style="display: block; margin: auto; width: 40px; height: 25px;" src="clips/arrow_right.png"></div></a>';
	str+='<a href="javascript:goback();"><div id="backward" class="button100" "backward" >BACK <img style="display: block; margin: auto; width: 44px; height: 30px;" src="clips/arrow_down.png"></div></a><br>';
	str+'</div>';
	div.innerHTML=str;
	div.classList.add("container");
	document.body.appendChild(div);
	var inventory_container=document.getElementById("inventory");
	// create empty inventory
	for(var i=0;i<6;i++)
	{
		inventory[i]={};
		inventory[i].empty=true;
		inventory[i].dom=document.createElement("img");
		inventory[i].dom.src="pokemon/inventory_empty.png";
		inventory[i].dom.style.width="32px";
		inventory[i].dom.style.height="32px";
		inventory_container.appendChild(inventory[i].dom);
	}
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
var ctx=-1;
function drawMap()
{
	var w=100,h=120,i;
	var ctx=document.getElementById("map").getContext("2d");
	ctx.clearRect(0, 0, w, h);
	ctx.save();
	ctx.strokeStyle = '#fff';
	ctx.fillStyle = '#0f0';
	ctx.translate(10,100);
	ctx.scale(25,-25);
	ctx.lineWidth = 0.01;
	for(i=0;i<connections.length;i++)
	{
		var a=nodes[connections[i][0].node];
		var b=nodes[connections[i][1].node];
		ctx.beginPath();
			ctx.moveTo(a.pos[0],a.pos[1]);
			ctx.lineTo(b.pos[0],b.pos[1]);
		ctx.stroke();
	}
	ctx.lineWidth = 0.02;
	for(i=0;i<nodes.length;i++)
	{
		var n=nodes[i];
		if(tour.node==i)
		{
			ctx.beginPath();
				ctx.arc(n.pos[0],n.pos[1],0.1,0,Math.PI*2);
			ctx.fill();
		}
		ctx.beginPath();
			ctx.arc(n.pos[0],n.pos[1],0.1,0,Math.PI*2);
		ctx.stroke();
	}
	// show the dir
	ctx.strokeStyle = '#0f0';
	var dirs=[{x:1,y:0},{x:0,y:-1},{x:-1,y:0},{x:0,y:1}]; // don't know if this is correct!
	var p=nodes[tour.node];
	var dx=dirs[tour.dir].x;
	var dy=dirs[tour.dir].y;
	ctx.beginPath();
//		ctx.moveTo(p.pos[0],p.pos[1]);
		ctx.moveTo(p.pos[0]+dx*0.5,p.pos[1]+dy*0.5);
		ctx.lineTo(p.pos[0]+dy*0.3,p.pos[1]-dx*0.3);
		ctx.lineTo(p.pos[0]-dy*0.3,p.pos[1]+dx*0.3);
	ctx.fill();
	ctx.restore();
}
function updateView()
{
	if(verbose)
	{
		console.log("update view load img "+tour.node+","+[tour.dir]);
		console.log("update view load img "+JSON.stringify(nodes));
		console.log("update view load img "+nodes[tour.node].img[tour.dir]);
	}
	drawMap();
	loadMain(tour.node,tour.dir);
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
		document.getElementById("forward").className="button100";
	}else
	{
		document.getElementById("forward").className="button100 grey";
	}
	if(tour.backward!=-1)
	{
		console.log("You can go backward to "+tour.backward);
		document.getElementById("backward").className="button100";
	}else
	{
		document.getElementById("backward").className="button100 grey";
	}
	setFeedback(nodes[tour.node].img[tour.dir]);//+" "+old+"/"+nodes[tour.node].img.length +"->"+tour.dir+"/"+nodes[tour.node].img.length);
}
function go()
{
	if(tour.forward!=-1)
	{
		tour.node=tour.forward;
		updateView();
	}
}
function goback()
{
	if(tour.backward!=-1)
	{
		tour.node=tour.backward;
		updateView();
	}
}
function loadMain(node,dir)
{
	var div=document.getElementById("main");
	var node=nodes[node];
	var back=node.img[dir];
	div.style.backgroundImage = "url(images_enkhuizerzand/"+back+")";
	// show item if it's there..
	var item=document.getElementById("item");
	var wrapper=document.getElementById("main");
	var item_data=node.item;
	if(item_data.direction==dir)
	{
		console.log("show the item at "+item_data.x+","+item_data.y);
		// we have an item..
		var f=1;
		if(wrapper.clientWidth*3>wrapper.clientHeight*4)
		{
			// smaller width!
			f=wrapper.clientHeight/600;
		}else{
			f=wrapper.clientWidth/800;
		}
		
		item.style.display="block";
		item.src="pokemon/"+item_data.src;
		item.style.position="absolute";
		item.style.left=(wrapper.clientWidth/2+item_data.x*f)+"px";
		item.style.top=(wrapper.clientHeight/2+item_data.y*f)+"px"; // counted from middle of the window..
		item.style.width=(128*f)+"px";
		item.style.height=(128*f)+"p";
		item.style.cursor="pointer";
		item.addEventListener("click",catchemAll);
	}else{
		item.style.display="none";
	}
	
}
//window.onresize=resizeMain; // this should alsod calc the wrapper, because clientWidth is wrong.
function catchemAll()
{
	// erase current item,
	var item_data=nodes[tour.node].item;
	item_data.direction=-1; // nowhere, current item will no longer be displayed.
	console.log(JSON.stringify(item_data));
	var handled=false;
	// put in inventory
	for(var i=0;i<inventory.length && handled==false;i++)
	{
		console.log("inventory["+i+"].dom.src: "+inventory[i].dom.src);
		if(inventory[i].empty)
		{
			inventory[i].empty=false;
			inventory[i].dom.src="pokemon/"+item_data.src;
			 handled=true;
		}
	}
	loadMain(tour.node,tour.dir); // update current page!
	
}
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