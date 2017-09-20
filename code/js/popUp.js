/*

.panoPopup{
  height:200px; width: 250px; background-color: green; position: fixed; z-index: 3; left: 45%; top: 45%;
}
*/

(function()
{

  var viewer = document.getElementById('view3D');

  function showPanoPopup(str)
  {
    var defaultHTML=`
    // <!-- popup for instructions. Button removes it. -->d
    <div class="panoPopUp" >
      <p>
        How to use the program: yadda yadda yadda
      </p>
        <button type="button"
        style="z-index: 4;  height: 30px; width: 250px; float: bottom;" id="i"
        onclick="document.body.removeChild(this.parentNode);"> I get it.
        </button>
    </div>`;
    panoPopup.innerHTML=defaultHTML;
    viewer.appendChild(panoPopup);
    var panoPopup=document.createElement("div");
    panoPopup.id="panoPopup";
  }

  window.PV.panoPopup=showPanoPopup;

})();
