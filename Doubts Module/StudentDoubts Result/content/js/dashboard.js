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

    var data = {"OkPercent": 99.68, "KoPercent": 0.32};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.355, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [0.915, 500, 1500, "PUT\/doubts\/DOUBT_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/userDetails\/USER_PERM"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES"], "isController": false}, {"data": [0.98, 500, 1500, "OPTIONS\/doubts\/DOUBT_id"], "isController": false}, {"data": [0.99, 500, 1500, "OPTIONS\/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69"], "isController": false}, {"data": [0.995, 500, 1500, "OPTIONS\/nodes\/getrole?type=teacher"], "isController": false}, {"data": [0.71, 500, 1500, "POST\/doubts"], "isController": false}, {"data": [0.0, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.995, 500, 1500, "OPTIONS\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [0.0, 500, 1500, "GET\/user-book-statuses"], "isController": false}, {"data": [0.505, 500, 1500, "GET\/BOOK_VERSION\/books\/SUB\/CHAPTER\/sections.json"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/student-doubts"], "isController": false}, {"data": [0.92, 500, 1500, "GET\/doubts\/DOUBT_ID"], "isController": false}, {"data": [0.435, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [1.0, 500, 1500, "POST\/events"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/doubts"], "isController": false}, {"data": [0.5, 500, 1500, "GET\/BOOK_VERSION\/books\/SUB_1\/chapters.json"], "isController": false}, {"data": [0.04, 500, 1500, "GET\/usernodesbyrole"], "isController": false}, {"data": [0.83, 500, 1500, "GET\/otps\/checkuser\/phone_num"], "isController": false}, {"data": [0.865, 500, 1500, "GET\/nodes\/getrole"], "isController": false}, {"data": [0.85, 500, 1500, "GET\/IP"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/events"], "isController": false}, {"data": [0.545, 500, 1500, "GET\/userDetails\/USER_PERM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2500, 8, 0.32, 1750.2128000000007, 32, 21437, 246.0, 6604.000000000002, 11686.649999999932, 18493.349999999984, 16.928264785146464, 131.44714948123334, 14.035211108158071], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 100, 0, 0.0, 1361.2500000000002, 447, 4313, 1152.0, 2316.7, 2432.3999999999996, 4296.649999999991, 4.23477598035064, 53.6171438288727, 2.845240111798086], "isController": false}, {"data": ["PUT\/doubts\/DOUBT_ID", 100, 0, 0.0, 411.10000000000014, 80, 1442, 262.0, 1250.9, 1310.6999999999998, 1441.8899999999999, 4.241781548250265, 8.75758052757158, 13.447524522799576], "isController": false}, {"data": ["OPTIONS\/userDetails\/USER_PERM", 100, 0, 0.0, 206.64000000000001, 150, 354, 192.5, 295.1, 332.34999999999985, 353.86999999999995, 4.119973632168754, 1.7542075230718523, 2.3134617563447595], "isController": false}, {"data": ["OPTIONS\/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES", 100, 0, 0.0, 182.25, 148, 307, 169.0, 232.9, 256.34999999999985, 306.8399999999999, 5.134260923140114, 2.1860720336807518, 3.0825119852903424], "isController": false}, {"data": ["OPTIONS\/doubts\/DOUBT_id", 100, 2, 2.0, 65.89999999999999, 47, 279, 52.0, 96.9, 162.69999999999993, 278.2099999999996, 4.153513872736335, 1.8986912537381624, 2.2657742669048013], "isController": false}, {"data": ["OPTIONS\/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69", 100, 0, 0.0, 239.69000000000005, 154, 584, 221.5, 336.6000000000001, 365.6499999999999, 584.0, 4.4664790745455365, 1.9017430434588414, 2.7697404417347804], "isController": false}, {"data": ["OPTIONS\/nodes\/getrole?type=teacher", 100, 0, 0.0, 192.05999999999995, 145, 1198, 170.0, 226.9, 238.74999999999994, 1188.8399999999954, 5.609154139555755, 2.388272660982724, 3.0948946180166033], "isController": false}, {"data": ["POST\/doubts", 100, 0, 0.0, 2099.2, 172, 11338, 245.0, 10092.700000000012, 10901.449999999995, 11337.99, 2.8282142655127553, 3.647015438514622, 4.282037922818033], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 100, 0, 0.0, 10770.94, 2305, 21437, 10050.5, 19803.100000000002, 21221.299999999996, 21436.85, 2.552518059065268, 40.180971536232995, 2.218497141179774], "isController": false}, {"data": ["OPTIONS\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 0, 0.0, 228.33999999999992, 154, 647, 217.0, 308.80000000000007, 331.74999999999994, 644.9599999999989, 4.49802087081684, 1.915172948902483, 2.653129498020871], "isController": false}, {"data": ["GET\/user-book-statuses", 100, 0, 0.0, 11262.18, 2558, 18667, 12178.5, 16803.000000000004, 17539.55, 18666.28, 3.099717925668764, 33.483280169942034, 2.7122531849601685], "isController": false}, {"data": ["GET\/BOOK_VERSION\/books\/SUB\/CHAPTER\/sections.json", 100, 0, 0.0, 620.0500000000004, 500, 786, 607.5, 708.8, 721.5999999999999, 785.96, 2.7949355767349564, 6.815275720394644, 2.051329865284105], "isController": false}, {"data": ["GET\/student-doubts", 100, 0, 0.0, 101.52999999999997, 32, 236, 91.0, 179.20000000000005, 210.44999999999987, 235.92999999999995, 4.113364320677882, 5.7468198552095755, 3.647397268726091], "isController": false}, {"data": ["GET\/doubts\/DOUBT_ID", 100, 0, 0.0, 354.01000000000005, 173, 780, 293.5, 681.8000000000002, 752.0999999999998, 779.99, 4.125412541254125, 8.51962149339934, 3.3398115202145218], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 0, 0.0, 4207.860000000001, 173, 12002, 5406.5, 9420.9, 9492.95, 11988.909999999993, 3.374843913469002, 5.329781573774088, 2.844228805980223], "isController": false}, {"data": ["OPTIONS\/license-assignments\/userbooksBasedOnLicence", 100, 0, 0.0, 52.93, 47, 230, 50.0, 56.0, 65.69999999999993, 228.7899999999994, 5.651313930488839, 2.400704648205708, 3.2174961147216727], "isController": false}, {"data": ["POST\/events", 100, 0, 0.0, 178.58, 66, 410, 143.5, 344.8, 392.2999999999996, 409.99, 4.231192350004231, 3.5304837575103662, 4.440396713950241], "isController": false}, {"data": ["OPTIONS\/doubts", 100, 0, 0.0, 190.23000000000002, 148, 336, 169.5, 240.8, 295.1499999999998, 335.88999999999993, 2.830936473785528, 1.2053596704789946, 1.5094641744989243], "isController": false}, {"data": ["GET\/BOOK_VERSION\/books\/SUB_1\/chapters.json", 100, 0, 0.0, 781.22, 687, 985, 767.5, 851.9, 882.0, 984.2599999999996, 2.7691626052281793, 3.859628551451041, 1.6924613442207574], "isController": false}, {"data": ["GET\/usernodesbyrole", 100, 3, 3.0, 7686.079999999997, 863, 18297, 6648.5, 16512.700000000008, 17011.2, 18295.86, 2.6712969146520633, 336.3694987979164, 2.2794458311072523], "isController": false}, {"data": ["GET\/otps\/checkuser\/phone_num", 100, 0, 0.0, 503.59999999999997, 195, 1473, 338.0, 1082.3000000000002, 1162.4499999999998, 1471.3599999999992, 5.126364894653202, 6.796688768775311, 2.9236299789819036], "isController": false}, {"data": ["GET\/nodes\/getrole", 100, 0, 0.0, 497.99, 169, 2609, 292.0, 648.6000000000006, 2439.3999999999996, 2608.4599999999996, 5.065086359722433, 2.8715181488375627, 4.075811680089146], "isController": false}, {"data": ["GET\/IP", 100, 0, 0.0, 434.09999999999997, 208, 1247, 261.5, 849.5, 1042.85, 1246.3299999999997, 5.019324398935903, 9.037626894794961, 2.7400413466847366], "isController": false}, {"data": ["OPTIONS\/events", 100, 0, 0.0, 60.0, 47, 103, 57.0, 73.0, 83.79999999999995, 103.0, 4.236390595212878, 1.7996385829273458, 2.258856704088117], "isController": false}, {"data": ["GET\/userDetails\/USER_PERM", 100, 3, 3.0, 1067.59, 198, 7488, 642.5, 1973.5000000000002, 6999.75, 7484.239999999998, 4.07066677521778, 34.12013809737035, 3.3153672759097943], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502\/Proxy Error", 3, 37.5, 0.12], "isController": false}, {"data": ["500\/Internal Server Error", 3, 37.5, 0.12], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, 25.0, 0.08], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2500, 8, "502\/Proxy Error", 3, "500\/Internal Server Error", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OPTIONS\/doubts\/DOUBT_id", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/usernodesbyrole", 100, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/userDetails\/USER_PERM", 100, 3, "502\/Proxy Error", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
