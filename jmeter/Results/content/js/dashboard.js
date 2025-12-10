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

    var data = {"OkPercent": 99.11111111111111, "KoPercent": 0.8888888888888888};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7542372881355932, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.625, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/logout"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demowebshop.tricentis.com/login"], "isController": false}, {"data": [0.85, 500, 1500, "https://demowebshop.tricentis.com/register"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demowebshop.tricentis.com/electronics"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demowebshop.tricentis.com/cell-phones"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demowebshop.tricentis.com/logout-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demowebshop.tricentis.com/logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demowebshop.tricentis.com/smartphone"], "isController": false}, {"data": [0.95, 500, 1500, "https://demowebshop.tricentis.com/register-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demowebshop.tricentis.com/register-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 225, 2, 0.8888888888888888, 622.9999999999997, 150, 6341, 381.0, 1071.6000000000001, 1409.6999999999996, 5552.140000000002, 0.6843148943417803, 13.9025075341169, 0.706528397357328], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/", 40, 1, 2.5, 986.9999999999999, 331, 5620, 876.5, 1530.2, 2678.9, 5620.0, 0.12494299475864139, 4.325053061728086, 0.08571528693158746], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout", 11, 0, 0.0, 698.0909090909091, 537, 1068, 669.0, 1027.4, 1068.0, 1068.0, 0.07320595497168261, 2.6321258302220802, 0.13654626366788455], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 21, 1, 4.761904761904762, 602.2380952380952, 275, 5359, 303.0, 687.4000000000001, 4893.399999999993, 5359.0, 0.1305937663242208, 2.920480833810104, 0.13217881901258674], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register", 40, 0, 0.0, 626.3999999999997, 295, 6341, 380.0, 896.9, 953.5, 6341.0, 0.13580360083247608, 1.7545719130992758, 0.1923398069212305], "isController": false}, {"data": ["https://demowebshop.tricentis.com/electronics", 17, 0, 0.0, 1011.705882352941, 351, 2685, 882.0, 1775.3999999999992, 2685.0, 2685.0, 0.06897671021666801, 1.5112231383895967, 0.059074780136736185], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cell-phones", 17, 0, 0.0, 506.52941176470586, 352, 1137, 393.0, 1052.1999999999998, 1137.0, 1137.0, 0.06930345946562956, 1.7928886178749928, 0.05935462299937219], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-1", 11, 0, 0.0, 401.3636363636363, 342, 558, 366.0, 542.6, 558.0, 558.0, 0.07354760201386706, 2.594779509721656, 0.06995641050928372], "isController": false}, {"data": ["https://demowebshop.tricentis.com/logout-0", 11, 0, 0.0, 295.45454545454544, 186, 696, 229.0, 661.2000000000002, 696.0, 696.0, 0.07338519220248975, 0.04952067169132854, 0.0670786522475883], "isController": false}, {"data": ["Test", 11, 1, 9.090909090909092, 7221.272727272728, 4685, 11276, 6981.0, 11197.800000000001, 11276.0, 11276.0, 0.06873582323645748, 17.478554471968284, 0.726571336068186], "isController": true}, {"data": ["https://demowebshop.tricentis.com/smartphone", 17, 0, 0.0, 692.4705882352941, 339, 1601, 372.0, 1419.3999999999999, 1601.0, 1601.0, 0.06952083784877991, 2.279319422946375, 0.059472904253448436], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-1", 20, 0, 0.0, 219.79999999999998, 150, 686, 161.0, 491.5000000000005, 677.4499999999998, 686.0, 0.076966000269381, 0.11236735390891073, 0.07155432837544014], "isController": false}, {"data": ["https://demowebshop.tricentis.com/register-0", 20, 0, 0.0, 283.5, 193, 596, 219.0, 475.1, 589.9999999999999, 596.0, 0.0768737003540034, 0.03918756990702126, 0.09095720248917043], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 5,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 50.0, 0.4444444444444444], "isController": false}, {"data": ["The operation lasted too long: It took 5,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 50.0, 0.4444444444444444], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 225, 2, "The operation lasted too long: It took 5,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://demowebshop.tricentis.com/", 40, 1, "The operation lasted too long: It took 5,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/login", 21, 1, "The operation lasted too long: It took 5,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
