(function() 
{	
	var plug_in="panoPopup";
	function init()
	{
		if(typeof(window.panoSphere)=="undefined")
		{
			console.log(plug_in+" plug-in cannot initialise, panoSphere not ready..");
			return;
		}
		
		console.log(plug_in+" plug-in initialises");
		// our initialisation code goes here.
		
	
		function showPopup(msg)
		{
			// create a layer on top of the panoSphere..
			var dom = document.createElement('div');
			dom.id="temp_popup";
			dom.innerHTML=msg;
			dom.style.cssText = `
			position: fixed;
			width: 300px;
			height: 400px;
			padding: 20px; 
			top: 50%;
			left: 50%;
			margin-top: -210px; /* Negative half of height. */
			margin-left: -160px; /* Negative half of width. */
			opacity: 0.3;
			text-align: center;
			z-index:100;background:#fff;
			`;
			document.body.appendChild(dom);
			setTimeout(removePopup.bind(this),1000);
		}
		function removePopup()
		{
			document.getElementById("temp_popup").remove();
			
		}
		
		// create your plug-in
		window.panoSphere.popup={};
		window.panoSphere.popup.show=showPopup;
		window.panoSphere.popup.remove=showPopup;
		window.panoSphere.addEventListener(panoSphereEvent);
		
		
	}
	function panoSphereEvent(ev)
	{
		console.log(plug_in+"  plug-in receives event: "+JSON.stringify(ev));
	}
	  
	window.addEventListener("load",init.bind(this)); // wait until window is loaded..
})();
