/**
 * Created by Jesse de Jong on 20-9-2017.
 */
$(document).ready(function() {
    var keyCodes = [61, 107, 173, 109, 187, 189];

    $(document).keydown(function (event) {
        if (event.ctrlKey == true && (keyCodes.indexOf(event.which) != -1)) {
            alert('Je kan niet zoomen op deze pagina!');
            event.preventDefault();
        }
    });

    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.ctrlKey == true) {
            alert('Je kan niet zoomen op deze pagina!');
            event.preventDefault();
        }
    })
});