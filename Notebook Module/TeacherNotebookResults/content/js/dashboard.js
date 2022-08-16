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
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6826923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.325, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [0.55, 500, 1500, "GET\/annotations"], "isController": false}, {"data": [0.025, 500, 1500, "GET\/user-book-statuses"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/chapters.json"], "isController": false}, {"data": [0.7, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [0.625, 500, 1500, "GET\/annotations2"], "isController": false}, {"data": [0.825, 500, 1500, "GET\/otps\/checkuser\/PHONE_NUM"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/annotations?chapter=CHAPTER_ID&book_id=BOOK_ID&users_permissions_user=USERPERMS-36"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/annotations?chapter=CHAPTER_ID2&book_id=BOOK_ID&users_permissions_user=USERPERMS"], "isController": false}, {"data": [0.0, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.825, 500, 1500, "GET\/Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 260, 0, 0.0, 1001.8961538461543, 48, 5950, 318.0, 3457.2000000000007, 4598.849999999999, 5761.489999999999, 14.306938865349695, 61.138143210394546, 10.475920665272659], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 20, 0, 0.0, 1201.8500000000001, 770, 2483, 926.0, 1851.0, 2451.5499999999993, 2483.0, 2.7731558513588466, 22.54069281232668, 1.863214087631725], "isController": false}, {"data": ["GET\/annotations", 20, 0, 0.0, 863.05, 70, 2153, 559.5, 1935.5000000000005, 2143.1499999999996, 2153.0, 1.9833399444664814, 1.9559334403510513, 1.843886354621182], "isController": false}, {"data": ["GET\/user-book-statuses", 20, 0, 0.0, 3704.75, 1223, 4954, 3860.0, 4889.000000000001, 4952.35, 4954.0, 1.4806040864672787, 22.331384642434113, 1.2926367708024875], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/chapters.json", 20, 0, 0.0, 321.70000000000005, 258, 424, 312.5, 405.1000000000001, 423.25, 424.0, 1.9054878048780488, 4.9591064453125, 1.1332442120807926], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 20, 0, 0.0, 606.1, 121, 1911, 559.0, 1351.5000000000007, 1884.3999999999996, 1911.0, 2.398369109005876, 4.629859508034536, 2.016597463724667], "isController": false}, {"data": ["GET\/annotations2", 20, 0, 0.0, 745.15, 69, 1737, 554.0, 1664.2000000000003, 1733.85, 1737.0, 2.085288291106245, 5.385501381503493, 1.9386664581378377], "isController": false}, {"data": ["GET\/otps\/checkuser\/PHONE_NUM", 20, 0, 0.0, 397.65, 127, 1109, 262.5, 1043.6000000000008, 1107.95, 1109.0, 3.484320557491289, 5.353570067508711, 1.9803462543554007], "isController": false}, {"data": ["OPTIONS\/annotations?chapter=CHAPTER_ID&book_id=BOOK_ID&users_permissions_user=USERPERMS-36", 20, 0, 0.0, 63.6, 48, 149, 56.0, 93.9, 146.24999999999994, 149.0, 1.9890601690701142, 0.8449620835405272, 1.2625870213823969], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json", 20, 0, 0.0, 123.10000000000001, 94, 156, 114.0, 155.20000000000002, 156.0, 156.0, 2.065688907250568, 5.5466974798595325, 1.489151905598017], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json", 20, 0, 0.0, 126.44999999999999, 87, 174, 125.0, 158.8, 173.25, 174.0, 1.96811651249754, 3.205108492422751, 1.4188121186774256], "isController": false}, {"data": ["OPTIONS\/annotations?chapter=CHAPTER_ID2&book_id=BOOK_ID&users_permissions_user=USERPERMS", 20, 0, 0.0, 101.25, 48, 322, 55.0, 287.7000000000001, 320.5, 322.0, 2.0848535390388823, 0.8856555561346815, 1.3233933597414782], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 20, 0, 0.0, 4261.55, 1878, 5950, 4745.0, 5807.900000000001, 5943.35, 5950.0, 1.4119308153900458, 22.22412195552418, 1.2078626897282034], "isController": false}, {"data": ["GET\/Login", 20, 0, 0.0, 508.45000000000005, 240, 932, 480.5, 905.5, 930.6999999999999, 932.0, 3.6062026685899746, 6.493453896952759, 1.9615770375045076], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 260, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
