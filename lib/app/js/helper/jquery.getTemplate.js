(function ($) {
    "use strict";

    $.fn.getTemplate = function () {
        var $template = $(this);
        var data = {
            html: $template.html(),
            container: $template.parent()
        };
        $template.remove();
        $template = null;
        return data;
    };
}(jQuery));