(function () {
    "use strict";

    APP.controller.SymbolList = function () {

        var view = new APP.view.SymbolList({
            onSymbolRowClick: onSymbolRowClick,
            onSymbolPriceClick: onSymbolPriceClick,
            getSymbols: getSymbols,
            onSymbolRemove: onSymbolRemove,
            onSymbolAdd: onSymbolAdd
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

        function onSymbolPriceClick(sData) {
            var symbolData = $.extend({}, symbolCache[sData.symbol], sData);
            view.showTicket(symbolData);
        }

        function onChartDataReceive(data) {
            view.renderChart(data);
        }

        function onLoad(data) {
            var i, l;
            for (i = 0, l = data.length; i < l; i++) {
                symbolCache[data[i].symbol] = data[i];
            }
            view.render(data);
            service.onUpdate(onUpdate);
        }

        function onUpdate(data) {
            var i, l;
            for (i = 0, l = data.length; i < l; i++) {
                var symbolCachedData = symbolCache[data[i].symbol];
                data[i].bidSparkLineData = symbolCachedData.bidSparkLineData || [];
                $.extend(symbolCachedData, data[i]);
                if (symbolCachedData.bidSparkLineData.length > 20) {
                    symbolCachedData.bidSparkLineData.shift();
                }
                symbolCachedData.bidSparkLineData.push(parseFloat(data[i].bidPrice));
                data[i].bidSparkLineData = symbolCachedData.bidSparkLineData;
            }
            view.update(data);
        }

        function getSymbols() {
            return service.getSymbols();
        }

        function onSymbolRemove(symbol) {
            service.removeSymbol(symbol);
        }

        function onSymbolAdd(symbol) {
            service.addSymbol(symbol);
        }

        return {
            load: load
        };
    };
}());