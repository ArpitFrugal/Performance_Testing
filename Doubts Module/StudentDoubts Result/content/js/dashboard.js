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

    var data = {"OkPercent": 99.77777777777777, "KoPercent": 0.2222222222222222};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6833333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.31, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [1.0, 500, 1500, "PUT\/doubts\/DOUBT_ID"], "isController": false}, {"data": [0.99, 500, 1500, "OPTIONS\/userDetails\/USER_PERM"], "isController": false}, {"data": [0.975, 500, 1500, "OPTIONS\/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/doubts\/DOUBT_id"], "isController": false}, {"data": [0.95, 500, 1500, "OPTIONS\/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/nodes\/getrole?type=teacher"], "isController": false}, {"data": [0.815, 500, 1500, "POST\/doubts"], "isController": false}, {"data": [0.0, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.935, 500, 1500, "OPTIONS\/doubts?grade=GRADE&subject=SUB_1&subject=SUB_2&subject=SUB_3&subject=SUB_4&subject=SUB_5&subject=SUB_6&_sort=created_At:DESC"], "isController": false}, {"data": [0.965, 500, 1500, "OPTIONS\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [0.0, 500, 1500, "GET\/user-book-statuses"], "isController": false}, {"data": [0.5, 500, 1500, "GET\/BOOK_VERSION\/books\/SUB\/CHAPTER\/sections.json"], "isController": false}, {"data": [0.995, 500, 1500, "GET\/student-doubts"], "isController": false}, {"data": [0.955, 500, 1500, "GET\/doubts\/DOUBT_ID"], "isController": false}, {"data": [0.255, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [1.0, 500, 1500, "POST\/events"], "isController": false}, {"data": [0.935, 500, 1500, "OPTIONS\/doubts"], "isController": false}, {"data": [0.495, 500, 1500, "GET\/BOOK_VERSION\/books\/SUB_1\/chapters.json"], "isController": false}, {"data": [0.02, 500, 1500, "GET\/usernodesbyrole"], "isController": false}, {"data": [0.775, 500, 1500, "GET\/otps\/checkuser\/phone_num"], "isController": false}, {"data": [0.385, 500, 1500, "GET\/nodes\/getrole"], "isController": false}, {"data": [0.83, 500, 1500, "GET\/IP"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/events"], "isController": false}, {"data": [0.15, 500, 1500, "GET\/userDetails\/USER_PERM"], "isController": false}, {"data": [0.215, 500, 1500, "GET\/doubts"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 6, 0.2222222222222222, 1936.275555555558, 2, 21062, 315.5, 7958.400000000003, 11160.14999999999, 16591.59999999999, 17.012374927539884, 186.0117248539771, 14.162439088215464], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 100, 0, 0.0, 1386.1200000000006, 431, 4430, 1203.5, 2195.8, 2517.249999999998, 4413.129999999992, 4.3911649760681515, 55.415043993984106, 2.950313968295789], "isController": false}, {"data": ["PUT\/doubts\/DOUBT_ID", 100, 0, 0.0, 212.19, 82, 497, 194.5, 357.20000000000005, 404.49999999999966, 496.96999999999997, 2.2679851220176, 4.652226629830809, 7.1914397382178175], "isController": false}, {"data": ["OPTIONS\/userDetails\/USER_PERM", 100, 1, 1.0, 69.13999999999999, 2, 248, 58.5, 104.0, 127.74999999999994, 247.22999999999962, 3.517658646404953, 1.5512393700752778, 1.955495297330097], "isController": false}, {"data": ["OPTIONS\/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES", 100, 0, 0.0, 302.9400000000001, 155, 3260, 226.0, 318.0, 372.54999999999967, 3240.82999999999, 3.869220352099052, 1.6474414780421747, 2.3237993325594895], "isController": false}, {"data": ["OPTIONS\/doubts\/DOUBT_id", 100, 0, 0.0, 95.08, 46, 411, 72.5, 178.50000000000009, 229.89999999999998, 409.6499999999993, 2.2485047443450106, 0.9552192713720377, 1.251609086207672], "isController": false}, {"data": ["OPTIONS\/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69", 100, 0, 0.0, 326.7600000000001, 157, 1576, 267.5, 467.10000000000014, 1145.4999999999932, 1573.2999999999986, 4.673552367154274, 1.989910968827406, 2.898150149553676], "isController": false}, {"data": ["OPTIONS\/nodes\/getrole?type=teacher", 100, 0, 0.0, 101.53999999999998, 47, 259, 87.5, 173.60000000000002, 185.0, 258.99, 4.08279916710897, 1.7345118375658353, 2.252716337320867], "isController": false}, {"data": ["POST\/doubts", 100, 0, 0.0, 486.43999999999966, 61, 2704, 120.0, 1669.600000000002, 2104.849999999998, 2699.3799999999974, 2.1230520996985267, 2.736041927625154, 3.216423931043268], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 100, 1, 1.0, 11833.949999999999, 2683, 19660, 11825.0, 18012.9, 19383.05, 19659.98, 2.311657689729305, 36.137417755553756, 1.9890640531450103], "isController": false}, {"data": ["OPTIONS\/doubts?grade=GRADE&subject=SUB_1&subject=SUB_2&subject=SUB_3&subject=SUB_4&subject=SUB_5&subject=SUB_6&_sort=created_At:DESC", 100, 0, 0.0, 342.3299999999999, 155, 1275, 238.5, 649.3000000000003, 1166.9499999999991, 1274.81, 2.5006251562890722, 1.0647193048262065, 1.9041137237434358], "isController": false}, {"data": ["OPTIONS\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 0, 0.0, 300.25999999999993, 148, 1301, 242.0, 433.70000000000005, 519.95, 1301.0, 4.665920119447555, 1.9866613008585294, 2.7521638204553938], "isController": false}, {"data": ["GET\/user-book-statuses", 100, 0, 0.0, 10461.579999999998, 1692, 17548, 11088.0, 15202.800000000005, 16014.15, 17544.55, 3.1304783370899076, 33.569152511034936, 2.739168544953669], "isController": false}, {"data": ["GET\/BOOK_VERSION\/books\/SUB\/CHAPTER\/sections.json", 100, 0, 0.0, 611.2500000000002, 554, 843, 606.0, 653.9, 676.4499999999998, 841.6099999999992, 2.0981955518254303, 5.148262923573228, 1.5384445158413764], "isController": false}, {"data": ["GET\/student-doubts", 100, 0, 0.0, 190.9999999999999, 46, 621, 176.0, 304.6, 348.9999999999998, 619.1599999999991, 3.448870494912916, 4.818449301603724, 3.058178134161062], "isController": false}, {"data": ["GET\/doubts\/DOUBT_ID", 100, 0, 0.0, 353.13000000000005, 165, 1411, 271.5, 480.9, 1267.75, 1410.8799999999999, 2.244568145088885, 4.605639021536631, 1.817135734647154], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 1, 1.0, 4380.23, 239, 11047, 3460.5, 8685.5, 9274.349999999995, 11042.169999999998, 2.969209299563526, 4.659802844502509, 2.50237072805012], "isController": false}, {"data": ["OPTIONS\/license-assignments\/userbooksBasedOnLicence", 100, 0, 0.0, 104.41999999999999, 48, 320, 82.0, 173.8, 257.95, 319.99, 4.078469758146744, 1.732553071087728, 2.3220194033198744], "isController": false}, {"data": ["POST\/events", 100, 0, 0.0, 150.98999999999995, 65, 378, 128.5, 292.9000000000003, 342.5499999999999, 377.7499999999999, 2.265159580492446, 1.889682835186989, 2.3772009210705143], "isController": false}, {"data": ["OPTIONS\/doubts", 100, 0, 0.0, 369.94000000000005, 149, 1348, 278.5, 1116.5000000000027, 1220.8499999999997, 1347.98, 2.114611968703743, 0.9003621272996405, 1.1275177098752378], "isController": false}, {"data": ["GET\/BOOK_VERSION\/books\/SUB_1\/chapters.json", 100, 1, 1.0, 1055.12, 718, 21059, 850.0, 968.3000000000001, 987.0, 20858.369999999897, 2.085853739935756, 2.9854800136101955, 1.2621452093154228], "isController": false}, {"data": ["GET\/usernodesbyrole", 100, 0, 0.0, 7849.419999999998, 1254, 14460, 7875.5, 13021.6, 14208.149999999992, 14459.96, 2.4098127575487385, 280.8870219533942, 2.056812841892185], "isController": false}, {"data": ["GET\/otps\/checkuser\/phone_num", 100, 0, 0.0, 535.6099999999999, 202, 1544, 449.0, 952.7000000000002, 1112.8499999999997, 1541.1699999999985, 5.14668039114771, 6.753510196860525, 2.935216160576428], "isController": false}, {"data": ["GET\/nodes\/getrole", 100, 0, 0.0, 2970.1100000000006, 82, 8705, 1465.5, 8632.1, 8648.9, 8705.0, 3.7847248505033684, 2.144800615963969, 3.045520778139429], "isController": false}, {"data": ["GET\/IP", 100, 0, 0.0, 492.97999999999996, 232, 1319, 365.5, 966.7000000000003, 1080.9499999999998, 1318.3799999999997, 5.007009813739234, 9.011199663904465, 2.7333188338674144], "isController": false}, {"data": ["OPTIONS\/events", 100, 0, 0.0, 65.77000000000002, 47, 165, 59.0, 102.50000000000003, 118.69999999999993, 164.8499999999999, 2.264185119775393, 0.9618364522483359, 1.207270581442739], "isController": false}, {"data": ["GET\/userDetails\/USER_PERM", 100, 0, 0.0, 3919.1999999999994, 295, 13179, 3886.5, 8963.200000000008, 11576.999999999987, 13175.789999999999, 2.6629740093736682, 22.77248465461227, 2.1688675037281637], "isController": false}, {"data": ["GET\/doubts", 100, 2, 2.0, 3311.94, 247, 21062, 1982.0, 6991.0, 7500.5, 21061.79, 1.64446637066272, 181.0610630190347, 1.6378660222414076], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502\/Proxy Error", 1, 16.666666666666668, 0.037037037037037035], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, 33.333333333333336, 0.07407407407407407], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 2, 33.333333333333336, 0.07407407407407407], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to salesmiddleware.onelern.school:443 [salesmiddleware.onelern.school\\\/13.251.241.246] failed: Connection timed out: connect", 1, 16.666666666666668, 0.037037037037037035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 2, "502\/Proxy Error", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to salesmiddleware.onelern.school:443 [salesmiddleware.onelern.school\\\/13.251.241.246] failed: Connection timed out: connect", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OPTIONS\/userDetails\/USER_PERM", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 100, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 1, "502\/Proxy Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/BOOK_VERSION\/books\/SUB_1\/chapters.json", 100, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to salesmiddleware.onelern.school:443 [salesmiddleware.onelern.school\\\/13.251.241.246] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/doubts", 100, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
