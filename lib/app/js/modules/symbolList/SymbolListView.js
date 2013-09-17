(function () {
    "use strict";

    APP.view.SymbolList = function () {

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
                        var sData = getSymbolDataFromLink($(this));
                        $lastDetail.remove();
                        $lastDetail = $(symbolDetailTemplate.html.supplant({
                            symbol: sData.symbol + " " + sData.type
                        }));
                        $(this).parents("tr").eq(0).after($lastDetail);
                        window.setTimeout(function () {
                            $lastDetail.find(".symbol-detail").addClass("show");
                        }, 1);
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

        function update(data) {
            var i, l;
            for (i = 0, l = data.length; i < l; i++) {
                $("#row_" + data[i].symbol).replaceWith(symbolListTemplate.html.supplant(data[i]));
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
            update: update
        };
    };
}());