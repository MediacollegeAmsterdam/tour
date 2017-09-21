(function() 
{	
	var plug_in="Your first";
	function init()
	{
		
		if(typeof(window.panoSphere)=="undefined")
		{
			console.log(plug_in+" plug-in cannot initialise, panoSphere not ready..");
		}else{
			console.log(plug_in+" plug-in initialises");
		}
		// create your plug-in
		window.panoSphere.plugInName={};
		window.panoSphere.addEventListener(panoSphereEvent)
	}
	function panoSphereEvent(ev)
	{
		console.log(plug_in+"  plug-in receives event: "+json.stringify(ev));
	}
	  
	window.addEventListener("load",init.bind(this)); // wait until window is loaded..
})();
