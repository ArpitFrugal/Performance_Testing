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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.65125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.275, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [0.675, 500, 1500, "PUT\/doubts\/DOUBT_ID"], "isController": false}, {"data": [0.825, 500, 1500, "GET\/otps\/checkuser\/PHONENUM"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/solutions"], "isController": false}, {"data": [0.6, 500, 1500, "POST\/events_Viewed_Doubt"], "isController": false}, {"data": [0.5, 500, 1500, "GET\/doubts\/DOUBT_ID"], "isController": false}, {"data": [0.725, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/assigneds"], "isController": false}, {"data": [0.125, 500, 1500, "GET\/doubts_GRADE_ID"], "isController": false}, {"data": [0.525, 500, 1500, "GET\/userDetails\/USERPERMS"], "isController": false}, {"data": [0.8, 500, 1500, "POST\/solutions"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.225, 500, 1500, "GET\/doubts_SUBJECT_ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST\/events_Responded_Doubt"], "isController": false}, {"data": [0.75, 500, 1500, "GET\/LOGINPAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/teacher-62"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/teacher-doubts_TOKEN"], "isController": false}, {"data": [0.975, 500, 1500, "POST\/assigneds"], "isController": false}, {"data": [0.0, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.025, 500, 1500, "GET\/doubts"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 400, 0, 0.0, 875.2350000000002, 0, 5547, 421.0, 2146.900000000001, 2892.4999999999995, 5240.6900000000005, 19.614573628205758, 571.0200325326092, 17.56811658718678], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 20, 0, 0.0, 1236.1000000000001, 410, 2027, 1225.5, 2023.8000000000002, 2027.0, 2027.0, 3.107520198881293, 25.25285017868241, 2.0817957582349287], "isController": false}, {"data": ["PUT\/doubts\/DOUBT_ID", 20, 0, 0.0, 911.4999999999999, 116, 3281, 589.0, 3102.3, 3272.9, 3281.0, 3.4965034965034967, 7.5337016499125875, 11.111983719405595], "isController": false}, {"data": ["GET\/otps\/checkuser\/PHONENUM", 20, 0, 0.0, 471.74999999999994, 102, 1226, 327.0, 986.1000000000001, 1214.1999999999998, 1226.0, 4.079135223332654, 6.267089345808689, 2.3184147460738327], "isController": false}, {"data": ["OPTIONS\/solutions", 20, 0, 0.0, 100.4, 51, 266, 81.0, 225.2000000000002, 264.4, 266.0, 7.465472191116088, 3.17136758118701, 4.002484602463606], "isController": false}, {"data": ["POST\/events_Viewed_Doubt", 20, 0, 0.0, 915.6500000000001, 102, 2643, 533.5, 2547.3, 2638.6, 2643.0, 2.6954177897574128, 2.2509634012803237, 2.834400269541779], "isController": false}, {"data": ["GET\/doubts\/DOUBT_ID", 20, 0, 0.0, 1002.0000000000001, 174, 2582, 620.5, 2420.9000000000005, 2575.45, 2582.0, 2.383506137528304, 5.130240920331308, 1.9296158086044572], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 20, 0, 0.0, 535.1, 88, 1255, 517.5, 1145.0000000000005, 1250.3, 1255.0, 3.157562361856647, 6.0954212878907486, 2.654942571834544], "isController": false}, {"data": ["OPTIONS\/assigneds", 20, 0, 0.0, 115.65, 60, 238, 99.5, 229.70000000000002, 237.65, 238.0, 7.547169811320755, 3.2060731132075473, 4.04628537735849], "isController": false}, {"data": ["GET\/doubts_GRADE_ID", 20, 0, 0.0, 1780.05, 1164, 2639, 1812.5, 2108.1, 2612.7, 2639.0, 2.430724355858046, 443.3440642850632, 2.039054903986388], "isController": false}, {"data": ["GET\/userDetails\/USERPERMS", 20, 0, 0.0, 894.85, 483, 1654, 889.0, 1331.6, 1637.8999999999996, 1654.0, 3.003003003003003, 23.592635604354353, 2.44580518018018], "isController": false}, {"data": ["POST\/solutions", 20, 0, 0.0, 496.3, 120, 1066, 294.0, 1066.0, 1066.0, 1066.0, 7.385524372230428, 19.881773910635154, 8.614882408604135], "isController": false}, {"data": ["Debug Sampler", 20, 0, 0.0, 1.4499999999999997, 0, 4, 1.0, 4.0, 4.0, 4.0, 14.88095238095238, 107.43132091703869, 0.0], "isController": false}, {"data": ["GET\/doubts_SUBJECT_ID", 20, 0, 0.0, 1623.7000000000003, 856, 2586, 1620.5, 2551.9000000000005, 2585.5, 2586.0, 2.024086630907803, 363.05116827750226, 2.0893159852241676], "isController": false}, {"data": ["POST\/events_Responded_Doubt", 20, 0, 0.0, 181.70000000000002, 91, 293, 156.5, 268.9, 291.79999999999995, 293.0, 13.468013468013467, 11.304450757575756, 14.22690446127946], "isController": false}, {"data": ["GET\/LOGINPAGE", 20, 0, 0.0, 620.3000000000001, 246, 1282, 531.5, 1066.2000000000003, 1271.6499999999999, 1282.0, 3.7544584193730057, 6.759125093861461, 2.0422200581941055], "isController": false}, {"data": ["GET\/teacher-62", 20, 0, 0.0, 241.9, 121, 471, 216.5, 389.20000000000005, 466.99999999999994, 471.0, 12.217470983506415, 33.116027794746486, 8.614271533292609], "isController": false}, {"data": ["GET\/teacher-doubts_TOKEN", 20, 0, 0.0, 334.34999999999997, 139, 467, 347.0, 398.8, 463.59999999999997, 467.0, 3.094059405940594, 4.323827158106435, 2.740538946472772], "isController": false}, {"data": ["POST\/assigneds", 20, 0, 0.0, 264.3499999999999, 130, 710, 226.0, 410.0, 694.9999999999998, 710.0, 9.505703422053232, 7.412406428231939, 9.524269249049429], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 20, 0, 0.0, 3841.1, 2664, 5547, 3559.5, 5479.7, 5543.7, 5547.0, 1.6849199663016006, 26.5210351727043, 1.4644323925863523], "isController": false}, {"data": ["GET\/doubts", 20, 0, 0.0, 1936.5, 1460, 2667, 1894.0, 2484.0, 2658.1, 2667.0, 2.1654395842356, 350.5047335155911, 1.7509609138155044], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 400, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
