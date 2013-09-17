(function () {
    "use strict";

    APP.service.SymbolList = function () {

        function load(callback) {
            callback((function () {
                var d = [], n;
                for (n = 0; n < 10; n++) {
                    d.push({
                        symbol: "ABC" + n,
                        bidPrice: (Math.random() * 100).toFixed(2),
                        bidDirection: [1, 0, -1][Math.floor(Math.random() * 3)],
                        askPrice: (Math.random() * 100).toFixed(2),
                        askDirection: [1, 0, -1][Math.floor(Math.random() * 3)]
                    });
                }
                return d;
            }()));

            setInterval(function () {
                $.publish("symbolist.update", (function () {
                    var d = [], n;
                    for (n = 0; n < parseInt(Math.random() * 5, 10); n++) {
                        d.push({
                            symbol: "ABC" + parseInt(Math.random() * 10, 10),
                            bidPrice: (Math.random() * 100).toFixed(2),
                            bidDirection: [1, 0, -1][Math.floor(Math.random() * 3)],
                            askPrice: (Math.random() * 100).toFixed(2),
                            askDirection: [1, 0, -1][Math.floor(Math.random() * 3)]
                        });
                    }
                    return d;
                }()));
            }, 200);
        }

        function onUpdate(callback) {
            $.subscribe("symbolist.update", callback);
        }

        return {
            load: load,
            onUpdate: onUpdate
        };
    };
}());