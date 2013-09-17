(function ($) {
    "use strict";

    var $obj = $({});

    $.publish = function (subject, message) {
        $obj.trigger(subject, [message]);
    };

    $.subscribe = function (subject, callback) {
        $obj.on(subject, function (e, m) {
            callback.call(this, m);
        });
    };

}(jQuery));