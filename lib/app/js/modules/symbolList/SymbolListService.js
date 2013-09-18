(function () {
    "use strict";

    var SYMBOLS = ["APPL", "MSFT", "GOOG", "SAMS", "NOK", "FTSE100", "FTSE250"];

    APP.service.SymbolList = function () {

        function load(callback) {
            callback((function () {
                var d = [], n;
                for (n = 0; n < SYMBOLS.length; n++) {
                    d.push({
                        symbol: SYMBOLS[n],
                        fullName: SYMBOLS[n] + " Full Name",
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
                            symbol: SYMBOLS[parseInt(Math.random() * SYMBOLS.length, 10)],
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

        function loadChartData(callback) {
            $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
                callback(data);
            });
        }

        function onUpdate(callback) {
            $.subscribe("symbolist.update", callback);
        }

        return {
            load: load,
            loadChartData: loadChartData,
            onUpdate: onUpdate
        };
    };
}());