/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43023255813953487, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36486486486486486, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demowebshop.tricentis.com/logout"], "isController": false}, {"data": [0.4, 500, 1500, "https://demowebshop.tricentis.com/login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/register"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demowebshop.tricentis.com/electronics"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demowebshop.tricentis.com/cell-phones"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demowebshop.tricentis.com/logout-1"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demowebshop.tricentis.com/logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.23076923076923078, 500, 1500, "https://demowebshop.tricentis.com/smartphone"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demowebshop.tricentis.com/register-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demowebshop.tricentis.com/register-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 205, 0, 0.0, 1738.8682926829265, 151, 13769, 1016.0, 4482.400000000001, 5368.399999999999, 10469.239999999998, 0.6323062212763332, 12.828409465508468, 0.6532585939668734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/", 37, 0, 0.0, 1833.4864864864867, 338, 9209, 1126.0, 4899.400000000001, 6514.400000000004, 9209.0, 0.1221888312803408, 4.231233333195734, 0.08224397105445659], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout", 11, 0, 0.0, 3376.3636363636365, 541, 13769, 1827.0, 12180.800000000007, 13769.0, 13769.0, 0.06349206349206349, 2.2828621031746033, 0.11842757936507936], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 20, 0, 0.0, 1814.25, 294, 5486, 1370.5, 5183.200000000004, 5481.5, 5486.0, 0.10548300668762263, 2.359368489720681, 0.10705907114301386], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register", 38, 0, 0.0, 1612.8157894736844, 308, 9565, 753.0, 5081.6, 5517.049999999988, 9565.0, 0.12150551730973995, 1.6398685881858268, 0.1676259040969742], "isController": false}, {"data": ["https://demowebshop.tricentis.com/electronics", 15, 0, 0.0, 1818.6666666666663, 673, 4602, 1465.0, 3765.6000000000004, 4602.0, 4602.0, 0.0771204261160611, 1.6896452733533502, 0.06604942744510311], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cell-phones", 13, 0, 0.0, 2369.1538461538457, 378, 9768, 1279.0, 7953.999999999998, 9768.0, 9768.0, 0.0773625327303023, 2.001377787654725, 0.06625677851999524], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-1", 11, 0, 0.0, 2404.3636363636365, 340, 10514, 1410.0, 9407.000000000004, 10514.0, 10514.0, 0.06356581083970436, 2.2426191877011714, 0.06046201148229692], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-0", 11, 0, 0.0, 970.5454545454545, 191, 3254, 416.0, 3020.4000000000005, 3254.0, 3254.0, 0.06458696635019054, 0.04358358764451334, 0.059036523929471035], "isController": false}, {"data": ["Test", 10, 0, 0.0, 16355.9, 5388, 29651, 11498.0, 29581.3, 29651.0, 29651.0, 0.05417675708767425, 13.886984237272527, 0.5779559515876499], "isController": true}, {"data": ["https://demowebshop.tricentis.com/smartphone", 13, 0, 0.0, 1798.5384615384614, 390, 5447, 1636.0, 4256.5999999999985, 5447.0, 5447.0, 0.07644675483525724, 2.5063934571133704, 0.06539780980047397], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-1", 18, 0, 0.0, 442.05555555555554, 151, 1294, 331.5, 960.1000000000005, 1294.0, 1294.0, 0.06462801193463953, 0.09435437289285753, 0.060083854845485195], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-0", 18, 0, 0.0, 1520.888888888889, 216, 5022, 626.5, 4224.600000000001, 5022.0, 5022.0, 0.06464240182435223, 0.03295247436749205, 0.07647527203677434], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 205, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
