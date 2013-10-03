(function () {
    "use strict";

    var BID_SPARK_LINE_CONFIG = {fillColor: false, lineColor: "#FAC5C5", spotRadius: 0};
    var DETAIL_CHART_CONFIG = {
        chart: {
        },

        rangeSelector: {
            selected: 1
        },

        series: [
            {
                name: 'Price',
                type: 'spline',
                tooltip: {
                    valueDecimals: 2
                }
            }
        ]
    };

    APP.view.SymbolList = function (options) {

        var eventInitialised = false;
        var symbolListTemplate, symbolDetailTemplate, symbolTicketRow;
        var $symbolFinder, $lastDetail = $();

        function render(data) {
            var i, l;
            symbolListTemplate = symbolListTemplate || $("#symbolListRow").getTemplate();
            symbolDetailTemplate = symbolDetailTemplate || $("#symbolDetailRow").getTemplate();
            symbolTicketRow = symbolTicketRow || $("#symbolTicketRow").getTemplate();
            for (i = 0, l = data.length; i < l; i++) {
                symbolListTemplate.container.append(symbolListTemplate.html.supplant(data[i]));
            }
            bindEvent();
        }

        function bindEvent() {
            
            $symbolFinder = $("#symbolFinder").autocomplete({
                lookup: options.getSymbols(),
                onSelect: function(o) {
                    options.onSymbolAdd(o.value);
                    $symbolFinder.data("autocomplete").setOptions({lookup: options.getSymbols()});
                    $symbolFinder.val("");
                }
            });

            if (!eventInitialised) {
                $("#symbolList")
                    .on("click", "a:not(.symbol-detail a, a.direction)", function (e) {
                        options.onSymbolRowClick(getSymbolDataFromLink($(this)));
                        e.preventDefault();
                    })
                    .on("click", "tr.symbol-list-row a.direction", function (e) {
                        options.onSymbolPriceClick(getSymbolDataFromLink($(this)));
                        e.preventDefault();
                    })
                    .on("click", ".symbol-detail a.close, .symbol-detail a.place-trade", function (e) {
                        $lastDetail.find(".symbol-detail").removeClass("show");
                        window.setTimeout(function () {
                            $lastDetail.remove();
                        }, 200);
                        e.preventDefault();
                    })
                    .on("click", ".symbol-remove", function (e) {
                        var symbol = getSymbolDataFromLink($(this));
                        var st = confirm("Delete symbol?");
                        if (st) {
                            $("#row_" + symbol.symbol).remove();
                            $("#detail_" + symbol.symbol).remove();
                            options.onSymbolRemove(symbol.symbol);
                            $symbolFinder.data("autocomplete").setOptions({lookup: options.getSymbols()});
                        }
                        e.preventDefault();
                    });
                eventInitialised = true;
            }
        }

        function showDetails(sData) {
            $lastDetail.remove();
            $lastDetail = $(symbolDetailTemplate.html.supplant(sData));
            $("#row_" + sData.symbol).after($lastDetail);
            window.setTimeout(function () {
                $lastDetail.find(".symbol-detail").addClass("show");
            }, 1);
        }

        function showTicket(sData) {
            $lastDetail.remove();
            $lastDetail = $(symbolTicketRow.html.supplant(sData));
            $lastDetail.find("." + sData.action).show();
            $("#row_" + sData.symbol).after($lastDetail);
            window.setTimeout(function () {
                $lastDetail.find(".symbol-detail").addClass("show");
            }, 1);
        }

        function renderChart(data) {
            window.setTimeout(function () {
                $.extend(true, DETAIL_CHART_CONFIG, {series: [
                    {data: data}
                ]});
                $lastDetail.find(".symbol-detail .chart").highcharts('StockChart', DETAIL_CHART_CONFIG);
            }, 200);
        }

        function update(data) {
            var i, l, $row, $detail;
            for (i = 0, l = data.length; i < l; i++) {
                $row = $("#row_" + data[i].symbol);
                $detail = $("#detail_" + data[i].symbol);
                if (!data[i].hidden && $row.length === 0) {
                    symbolListTemplate.container.append(symbolListTemplate.html.supplant(data[i]));
                }
                $row.find(".bid-price a").text(data[i].bidPrice).attr("class", "direction direction_" + data[i].bidDirection);
                $row.find(".ask-price a").text(data[i].askPrice).attr("class", "direction direction_" + data[i].askDirection);
                $("." + data[i].symbol + "__sparkLine").sparkline(data[i].bidSparkLineData, BID_SPARK_LINE_CONFIG);
                $detail.find(".bid-price a").text(data[i].bidPrice).attr("class", "direction direction_" + data[i].bidDirection);
                $detail.find(".ask-price a").text(data[i].askPrice).attr("class", "direction direction_" + data[i].askDirection);
            }
        }

        function getSymbolDataFromLink($link) {
            var values = (/\#(.*)/.exec($link.attr("href"))[1]).split("_");
            return {
                symbol: values[0],
                type: values[1],
                action: values[2]
            };
        }
        
        return {
            render: render,
            renderChart: renderChart,
            update: update,
            showDetails: showDetails,
            showTicket: showTicket
        };
    };
}());