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
        var symbolListTemplate, symbolDetailTemplate;
        var $lastDetail = $();

        function render(data) {
            var i, l;
            symbolListTemplate = symbolListTemplate || $("#symbolListRow").getTemplate();
            symbolDetailTemplate = symbolDetailTemplate || $("#symbolDetailRow").getTemplate();
            for (i = 0, l = data.length; i < l; i++) {
                symbolListTemplate.container.append(symbolListTemplate.html.supplant(data[i]));
            }
            bindEvent();
        }

        function bindEvent() {
            if (!eventInitialised) {
                $("#symbolList")
                    .on("click", "a:not(.symbol-detail a)", function (e) {
                        options.onSymbolRowClick(getSymbolDataFromLink($(this)));
                        e.preventDefault();
                    })
                    .on("click", ".symbol-detail a.close", function (e) {
                        $lastDetail.find(".symbol-detail").removeClass("show");
                        window.setTimeout(function () {
                            $lastDetail.remove();
                        }, 200);
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

        function renderChart(data) {
            $.extend(true, DETAIL_CHART_CONFIG, {series: [
                {data: data}
            ]});
            $lastDetail.find(".symbol-detail .chart").highcharts('StockChart', DETAIL_CHART_CONFIG);
        }

        function update(data) {
            var i, l;
            for (i = 0, l = data.length; i < l; i++) {
                $("#row_" + data[i].symbol).replaceWith(symbolListTemplate.html.supplant(data[i]));
                $("." + data[i].symbol + "__sparkLine").sparkline(data[i].bidSparkLineData, BID_SPARK_LINE_CONFIG);
            }
        }

        function getSymbolDataFromLink($link) {
            var values = (/\#(.*)/.exec($link.attr("href"))[1]).split("_");
            return {
                symbol: values[0],
                type: values[1]
            };
        }

        return {
            render: render,
            renderChart: renderChart,
            update: update,
            showDetails: showDetails
        };
    };
}());