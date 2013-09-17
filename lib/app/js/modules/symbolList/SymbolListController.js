(function () {
    "use strict";

    APP.controller.SymbolList = function () {
        var view = new APP.view.SymbolList();
        var service = new APP.service.SymbolList();

        function load() {
            service.load(view.render);
            service.onUpdate(function (data) {
                view.update(data);
            });

        }

        return {
            load: load
        };
    };
}());