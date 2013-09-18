(function () {
    "use strict";

    APP.controller.SymbolList = function () {
        var view = new APP.view.SymbolList({
            onSymbolRowClick: onSymbolRowClick
        });

        var service = new APP.service.SymbolList();

        var symbolCache = {};

        function load() {
            service.load(onLoad);
        }

        function onSymbolRowClick(sData) {
            var symbolData = $.extend({}, symbolCache[sData.symbol], sData);
            view.showDetails(symbolData);
            service.loadChartData(onChartDataReceive);
        }

        function onChartDataReceive(data) {
            view.renderChart(data);
        }

        function onLoad(data) {
            var i, l, i2, l2;
            for (i = 0, l = data.length; i < l; i++) {
                symbolCache[data[i].symbol] = data[i];
            }
            view.render(data);
            service.onUpdate(function (data) {
                for (i2 = 0, l2 = data.length; i2 < l2; i2++) {
                    var symbolCachedData = symbolCache[data[i2].symbol];
                    data[i2].bidSparkLineData = symbolCachedData.bidSparkLineData || [];
                    var bidDiff = data[i2].bidPrice - symbolCachedData.bidPrice;
                    $.extend(symbolCachedData, data[i2]);
                    data[i2].bidDirection = bidDiff > 0 ? 1 : (bidDiff < 0 ? -1 : 0);
                    if (symbolCachedData.bidSparkLineData.length > 20) {
                        symbolCachedData.bidSparkLineData.shift();
                    }
                    symbolCachedData.bidSparkLineData.push(parseFloat(data[i2].bidPrice));
                    data[i2].bidSparkLineData = symbolCachedData.bidSparkLineData;
                }
                view.update(data);
            });
        }

        return {
            load: load
        };
    };
}());