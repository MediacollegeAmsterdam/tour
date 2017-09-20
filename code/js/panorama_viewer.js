(function() 
{	
	
	/*
	Panorama viewer by Hjalmar Snoep
	Expects a view-element with ID view3D, it builds from there..
	*/

	// data..
	var mouse={x:0,y:0,down:false};
	var rotx = 0; // current x rotation
	var roty = 0; // current y rotation of origin
	var rtd=180/Math.PI;
	var current_node=0;
	 var objects=[];
	 var callback=null;

	function init()
	{
	// test the transformation on the total object
	// object3D.style.transform="rotateY(60deg)";
	
	 // change the view a bit, so it will be in the middle!

	  var perspective = 600; 
	  
	  var viewer = document.getElementById('view3D');
	  var w_v = viewer.clientWidth; // width of viewer
	  var h_v = viewer.clientHeight; // height of viewer
	   var cube_panel_size=w_v*1.5;

	  console.log(" initialised 3D viewer "+w_v+"x"+h_v);
 	  var persp=document.createElement("div");
	  persp.id="persp";
	  persp.style.position="absolute";
	  persp.style.left="0px";
	  persp.style.top="0px";
	  persp.style.perspective=perspective+"px"; // viewpoint/camera distance.
	  persp.style.transformStyle="preserve-3d"; // makes objects block each other.
	  persp.style.perspectiveOrigin="50% 50%"; // doesn't do anything, it seems, but this would put it in the middle, now we user marginLeft, marginTop..
	  persp.style.transformOrigin="50% 50%"; // doesn't do anything, it seems, but this would put it in the middle, now we user marginLeft, marginTop..
	  persp.style.marginLeft=(-(cube_panel_size-w_v)/2)+"px"; // this DOES!
	  persp.style.marginTop=(-(cube_panel_size-h_v)/2)+"px";
	  persp.style.width=cube_panel_size+"px"; 
	  persp.style.height=cube_panel_size+"px";

 	  var object3D=document.createElement("div");
	  object3D.style.transformStyle="preserve-3d"; // makes objects block each other.
	  object3D.style.transform="rotate3d(0, 0, 0 0)"; // enables 3D rotation moving of whole object
	  object3D.style.cursor="move"; 
	  object3D.style.position="relative"; 
	  object3D.style.width=cube_panel_size+"px"; 
	  object3D.style.height=cube_panel_size+"px"; 
	  object3D.id="object3D";
	  
	  viewer.appendChild(persp);
	  persp.appendChild(object3D);

	  // describe the object(s), sides of cube, inverted!!
	 
	  var cube_dist=cube_panel_size/2;
		objects.push( {id: "front",pos:{x:0,y:0,z:-cube_dist},rot: "0, 0, 0, 1deg" });
		objects.push( {id: "back",pos:{x:0,y:0,z:-cube_dist},rot:"0, 1, 0, 180deg" }); 
		
		objects.push( {id: "left",pos:{x:0,y:0,z:-cube_dist},rot:"0, 1, 0, 90deg" });
		objects.push( {id: "right",pos:{x:0,y:0,z:-cube_dist},rot:"0, 1, 0, -90deg" });
		
		objects.push( {id: "up",pos:{x:0,y:0,z:-cube_dist},rot: "1, 0, 0, -90deg"});
		objects.push( {id: "down",pos:{x:0,y:0,z:-cube_dist},rot:"1, 0, 0, 90deg" });
	  
	   // create the sides..
	  for(var i=0;i<objects.length;i++)
	  {
		  var cube_side=document.createElement("img");
		  console.log(cube_side);
		  cube_side.style.position="absolute";
		  cube_side.style.transformStyle="preserve-3d"; // makes objects block each other.
		  cube_side.style.top="0px";
		  cube_side.setAttribute("dir",objects[i].id);
		
		cube_side.addEventListener('touchstart', mouseDownHandler.bind(this),false);
		cube_side.addEventListener('pointerdown', mouseDownHandler.bind(this),false);
		cube_side.addEventListener('mousedown', mouseDownHandler.bind(this),false);
		
		cube_side.addEventListener('touchmove', mouseMoveHandler.bind(this),false);
		cube_side.addEventListener('mousemove', mouseMoveHandler.bind(this),false);
		cube_side.addEventListener('pointermove', mouseMoveHandler.bind(this),false);
		
		cube_side.addEventListener('touchend', mouseUpHandler.bind(this),false);
		cube_side.addEventListener('mouseup', mouseUpHandler.bind(this),false);
		cube_side.addEventListener('pointerup', mouseUpHandler.bind(this),false);
		
		
		  cube_side.style.left="0px";
		  cube_side.style.backfaceVisibility="hidden"; // turn this of, to look at just the cube from the outside
		  cube_side.style.webkitBackfaceVisibility="hidden"; //Safari fix - Added vendor attribute

		  cube_side.style.width=cube_panel_size+"px";
		  cube_side.style.height=cube_panel_size+"px";

		  var str="";
		  str+="rotate3D("+objects[i].rot+") ";
		  str+="translateX("+objects[i].pos.x+"px) ";
		  str+="translateY("+objects[i].pos.y+"px) ";
		  str+="translateZ("+objects[i].pos.z+"px) ";
//		  ";
		  //str='';
		  console.log(str);
		  cube_side.style.transform=str;
		  objects[i].dom=cube_side;
		  object3D.appendChild(objects[i].dom);
	  }
	
		showNode();
  }
  function showNode()
  {
	  for(var i=0;i<objects.length;i++)
	  {
			objects[i].dom.src="img/node"+current_node+"/"+objects[i].id+".jpg";
	  }
  }

	// handle the mouse..
	function mouseUpHandler(e) 
	{
	  e = e || window.event;
		mouse.down = false;
		
		// check if user moved the view!
		var dx=mouse.x-mouse.start_x;
		var dy=mouse.y-mouse.start_y;
		var dist_swiped=Math.sqrt(dx*dx+dy*dy);
		//console.log("distance swiped: "+dist_swiped);
		if(dist_swiped<20)
		{
			//console.log("click direction "+mouse.dir);
			if(callback!=null) callback(mouse.dir);
		}
		e.preventDefault();
     }

	 function mouseMoveHandler(e) 
	{
	  e = e || window.event;
		if( mouse.down) 
		{
			var m=transformMouseCoords(e);
		    var dx = m.x - mouse.x;
		    var dy = m.y - mouse.y;
		    mouse.x = m.x;
		    mouse.y = m.y;
			rotx += dy/5;
			roty -= dx/10; 
			// zorg dat je nooit over de kop kunt, met een paar graden speling
		  if(rotx>85) rotx=85;
		  if(rotx<-85) rotx=-85;

		  var i;
		  var str='rotateX(' + rotx + 'deg) rotateY(' + roty + 'deg)';
		 object3D.style.transform=str;
		 object3D.style.webkitTransform=str;
		 object3D.style.mozTransform=str;
		}
		e.preventDefault();
	}
 	function mouseDownHandler(e)
	{
		//console.log("handle type :"+e.type);
	  e = e || window.event;
			var m=transformMouseCoords(e);
			mouse.x = m.x;
			mouse.y = m.y;
			mouse.start_x=m.x; // keep the start x, to see if this might be a click!
			mouse.start_y=m.y;
			mouse.down = true;
			mouse.dir=e.target.getAttribute("dir");
			e.preventDefault();

	}

// helper function om muis offsets te kunnen berekenen, als dat nodig mocht worden.
  function transformMouseCoords(e)
  {
	  e = e || window.event;
	  var x,y;
	  if (e.pageX || e.pageY) 
	  { 
	  x = e.pageX;
	  y = e.pageY;
	 }
	 else { 
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	 } 
	return {x:x,y:e.y}; // nu gewoon de muiscoords ten opzichte van window.
  }
  
  
  function showCustomNode(o)
  {
	  console.log("\nshowing node:");
	  for(var i=0;i<objects.length;i++)
	  {
		  console.log(objects[i].id+"->"+o[objects[i].id]);
		  objects[i].dom.src=o[objects[i].id];
	  }
	  
  }
  function setCallback(cb)
  {
	  callback=cb;
  }
	  
	window.addEventListener("load",init.bind(this)); // wait until window is loaded..
	window.PV={}; // export PV
	window.PV.setCallback=setCallback;
	window.PV.showCustomNode=showCustomNode;
})();
