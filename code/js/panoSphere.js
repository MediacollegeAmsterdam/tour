(function PanoSphere(id,init_obj) 
{	
	/*
	Panorama Sphere viewer by Hjalmar Snoep and MD2A and MD2B
	*/
	// private data..
	var mouse={x:0,y:0,down:false};
	var rotx = 0; // current x rotation
	var roty = 0; // current y rotation of origin
	var rtd=180/Math.PI;// radial to Degrees
	var objects=[]; // this will contain the cube walls.
	var lastUserInteraction = 0; // timestamp of last user-interaction for
	var viewer=null;
//    var kandraaien = true;
	var eventListeners=[];

	/*
		OPTIONS GO HERE
	*/
	// set our default options!
	var options={};
	options.callback=null; // user gets to set a callback.
	options.perspective=600; 
	
	// Sphere mode options
	options.sphereMode=true; // user gets to set or unset panorama mode.
	options.verticalLimit=80; // from -80 to 80 degrees is your freedom in vertical rotation (x-axis)..
	
	// autoPan options
	options.autoPan=false; // you can set autopanning to true here..
	options.autoPanSpeed=0.1; // degrees per second
	options.autoPanInterval=1000; // start autoPan after this interval
	
	if(typeof(init_obj)!=undefined)
	{
		// override default options from init_object if provided!
		for(var all in init_obj)
		{
			options[all]=init_obj[all];
		}
	}
	
	
	// wait until the page is loaded, then run init!
	// the event listener is added here..
	window.addEventListener("load",init.bind(this)); // wait until window is loaded..
	function init()
	{
		// test the transformation on the total object
		// object3D.style.transform="rotateY(60deg)";

		// change the view a bit, so it will be in the middle!

		viewer = document.getElementById("view3D"); // get a 
		var w_v = viewer.clientWidth; // width of viewer
		var h_v = viewer.clientHeight; // height of viewer
		var biggest_value=(w_v>h_v)? w_v : h_v;
		var cube_panel_size=biggest_value*1.5;
		if(typeof(options.cubeSize)!="undefined") cube_panel_size=options.cubeSize*biggest_value;

		console.log(" initialising panoSphere in object 'view3D' size: "+w_v+"x"+h_v);
		var persp=document.createElement("div");
		persp.id="persp";
		persp.style.position="absolute";
		persp.style.left="0px";
		persp.style.top="0px";
		persp.style.perspective=options.perspective+"px"; // viewpoint/camera distance.
		//persp.style.transformStyle="preserve-3d"; // makes objects block each other.
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
			cube_side.style.transform=str;
			objects[i].dom=cube_side;
			object3D.appendChild(objects[i].dom);
		}

		showHoloDeck(); // show skybox, using built in holodeck grid pattern..
		autoPanLoop(); // start the autoPan Loop..
	}
	function showHoloDeck()
	{
		var can=document.createElement("canvas");
		can.width=500;
		can.height=500;
		var ctx=can.getContext("2d");
		ctx.fillStyle="#000";
		ctx.fillRect(0,0,500,500);
		ctx.strokeStyle="#063";
		var x,y;
		ctx.beginPath();
		for(x=0;x<500;x+=20)
		{
			ctx.moveTo(x,0);
			ctx.lineTo(x,500);
		}
		for(y=0;y<500;y+=20)
		{
			ctx.moveTo(0,y);
			ctx.lineTo(500,y);
		}
		ctx.stroke();
		ctx.textAlign="center";
		ctx.textBaseLine="middle";
		for(var i=0;i<objects.length;i++)
		{
			ctx.fillStyle="#000";
			ctx.fillRect(201,201,98,98);
			ctx.fillStyle="#063";
			//console.log(objects[i].id);
			ctx.fillText(objects[i].id,250,250);
			objects[i].dom.src=can.toDataURL();
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
			 broadCastEvent({type:"click",data:mouse.dir});

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


			if(options.sphereMode == true) 
			{
				// clamp rot X value to verticalLimit.
                if(rotx>options.verticalLimit) 
				{
					rotx=options.verticalLimit;
				}
                if(rotx<-options.verticalLimit) 
				{
					rotx=-options.verticalLimit;
				}
			} else
			{
				// sphereMode means you only look around 360 like a panoramaPhoto..
				rotx=0;
			}


		  var i;
		  setRotation();
		
		}
		e.preventDefault();
	}
	function setRotation()
	{
		  var str='rotateX(' + rotx + 'deg) rotateY(' + roty + 'deg)';
		 object3D.style.transform=str;
		 object3D.style.webkitTransform=str;
		 object3D.style.mozTransform=str;
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
        	lastUserInteraction = (new Date()).getTime();
			e.preventDefault();

	}
	function tienseconden() {
		lastUserInteraction = true;
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
	 // console.log("\nshowing node:");
	 broadCastEvent({type:"show",data:o});
	  for(var i=0;i<objects.length;i++)
	  {
		 // console.log(objects[i].id+"->"+o[objects[i].id]);
		  objects[i].dom.src=o[objects[i].id];
	  }
	  
  }
  
	function autoPanLoop() 
	{
		if(options.autoPan)
		{
			// check if it's time to go yet..
			var dt=(new Date()).getTime()-lastUserInteraction;
			if(dt>options.autoPanInterval)
			{
				roty += 0.1;
				var str = 'rotateX(' + rotx + 'deg) rotateY(' + roty + 'deg)';
				object3D.style.transform = str;
				object3D.style.webkitTransform = str;
				object3D.style.mozTransform = str;
			}
        }
        window.requestAnimationFrame( autoPanLoop.bind(this)); // loops for the duration of this pages life span..
    }
	function setSphereMode(bol)
	{
		options.sphereMode=bol;
		if(options.sphereMode==false)
		{
			rotx=0;
			setRotation();
		}			
	}
	function getSphereMode()
	{
		return options.sphereMode;
	}
	function setCallback(cb)
	{
		callback=cb;
	}
	function broadCastEvent(ev)
	{
		for(var i=0;i<eventListeners.length;i++)
		{
			eventListeners[i](ev);
		}
	}
	function addEventListener(cb)
	{
		eventListeners.push(cb);
	}
	function removeEventListener(cb)
	{
		console.log("removeEventListener not implemented yet..");
	}	
	// PUBLIC METHODS and varables
	console.log("initialising panoSphere")
	window.panoSphere={}; // export PV
	window.panoSphere.addEventListener=addEventListener;
	window.panoSphere.removeEventListener=removeEventListener;
	//window.panoSphere.resetView=resetView;
	window.panoSphere.setCallback=setCallback;
    window.panoSphere.setSphereMode=setSphereMode;
    window.panoSphere.getSphereMode=getSphereMode;
	window.panoSphere.showCustomNode=showCustomNode;
	window.panoSphere.options=options;
})();
