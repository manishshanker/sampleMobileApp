(function ($) {
    "use strict";

    var PRICE_SNAPSHOT = [];

    APP.service.SymbolList = function () {

        function load(callback) {

            var connection = new Firebase("https://ms-project-data.firebaseio.com/");

            connection.once("value", function (snapshot) {
                if (snapshot.val() && snapshot.val().gridData) {
                    var data = snapshot.val();
                    callback((function (data) {
                        var i;
                        for (i in data.gridData.rowData) {
                            if (data.gridData.rowData.hasOwnProperty(i)) {
                                PRICE_SNAPSHOT.push({
                                    symbol: data.gridData.rowData[i].colSymbol,
                                    fullName: data.gridData.rowData[i].colName,
                                    bidPrice: data.gridData.rowData[i].colBid.toFixed(2),
                                    bidUpdated: false,
                                    bidDirection: "",
                                    askPrice: data.gridData.rowData[i].colAsk.toFixed(2),
                                    askUpdated: false,
                                    askDirection: "",
                                    id: data.gridData.rowData[i].id,
                                    hidden: false
                                });
                            }
                        }
                        return PRICE_SNAPSHOT;
                    }(data)));
                }
            });

            connection.on("child_changed", function (newSnapshot) {
                var data = newSnapshot.val();
                if (data.userId) {
                    $.publish("symbolist.update", (function (data) {
                        var i, l, bidPrice, askPrice;
                        for (i = 0, l = PRICE_SNAPSHOT.length; i < l; i++) {
                            PRICE_SNAPSHOT[i].bidUpdated = false;
							PRICE_SNAPSHOT[i].askUpdated = false;
                            if (PRICE_SNAPSHOT[i].id === data.id) {
                                if (data.hasOwnProperty("colBid")) {
                                    bidPrice = data.colBid.toFixed(2);
                                    PRICE_SNAPSHOT[i].bidDirection = getPriceDirection(Number(PRICE_SNAPSHOT[i].bidPrice), Number(bidPrice));
                                    PRICE_SNAPSHOT[i].bidPrice = bidPrice;
									PRICE_SNAPSHOT[i].bidUpdated = true;
                                }
                                if (data.hasOwnProperty("colAsk")) {
                                    askPrice = data.colAsk.toFixed(2);
                                    PRICE_SNAPSHOT[i].askDirection = getPriceDirection(Number(PRICE_SNAPSHOT[i].askPrice), Number(askPrice));
                                    PRICE_SNAPSHOT[i].askPrice = askPrice;
									PRICE_SNAPSHOT[i].askUpdated = true;
                                }
                                break;
                            }
                        }
                        return PRICE_SNAPSHOT;
                    }(data)));
                }
            });
        }

        function getPriceDirection(oldPrice, newPrice, currValue) {
            if (oldPrice > newPrice) {
                return "down";
            } else if (oldPrice < newPrice) {
                return "up";
            }
            return currValue;
        }

        function loadChartData(callback) {
            $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
                callback(data);
            });
        }

        function onUpdate(callback) {
            $.subscribe("symbolist.update", callback);
        }

        function getSymbols() {
            var i, rt = [];
            for (i = 0; i < PRICE_SNAPSHOT.length; i++) {
                if (PRICE_SNAPSHOT[i].hidden) {
                    rt.push(PRICE_SNAPSHOT[i].symbol);
                }
            }
            return rt;
        }

        function removeSymbol(symbol) {
            return setSymbolVisibility(symbol, true);
        }

        function addSymbol(symbol) {
            var st = setSymbolVisibility(symbol, false);
            $.publish("symbolist.update", (function () {
                return PRICE_SNAPSHOT;
            }()));
            return st;
        }

        function setSymbolVisibility(symbol, hidden) {
            var i;
            for (i = 0; i < PRICE_SNAPSHOT.length; i++) {
                if (PRICE_SNAPSHOT[i].symbol === symbol) {
                    PRICE_SNAPSHOT[i].hidden = hidden;
                    return true;
                }
            }
            return false;
        }

        return {
            load: load,
            loadChartData: loadChartData,
            onUpdate: onUpdate,
            getSymbols: getSymbols,
            removeSymbol: removeSymbol,
            addSymbol: addSymbol
        };
    };
}(jQuery));