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

    var data = {"OkPercent": 98.84615384615384, "KoPercent": 1.1538461538461537};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5607692307692308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [0.26, 500, 1500, "GET\/annotations"], "isController": false}, {"data": [0.0, 500, 1500, "GET\/user-book-statuses"], "isController": false}, {"data": [0.945, 500, 1500, "GET\/v4\/books\/BOOK_ID\/chapters.json"], "isController": false}, {"data": [0.21, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [0.52, 500, 1500, "GET\/annotations2"], "isController": false}, {"data": [0.775, 500, 1500, "GET\/otps\/checkuser\/PHONE_NUM"], "isController": false}, {"data": [0.96, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json"], "isController": false}, {"data": [0.98, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json"], "isController": false}, {"data": [0.88, 500, 1500, "OPTIONS\/annotations?chapter=CHAPTER_ID&book_id=BOOK_IDusers_permissions_user=USERPERMS"], "isController": false}, {"data": [0.88, 500, 1500, "OPTIONS\/annotations?chapter=CHAPTER_ID2&book_id=BOOK_ID&users_permissions_user=USERPERMS"], "isController": false}, {"data": [0.0, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.76, 500, 1500, "GET\/Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 15, 1.1538461538461537, 3594.6246153846164, 1, 25728, 539.0, 12481.400000000001, 18040.450000000008, 23021.350000000002, 12.082008959274335, 49.50803751289522, 8.824368250339226], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 100, 1, 1.0, 3801.5900000000006, 327, 10098, 2460.0, 8702.9, 9402.349999999999, 10097.8, 3.327012010513358, 41.59167893502346, 2.2288381242306285], "isController": false}, {"data": ["GET\/annotations", 100, 4, 4.0, 5133.790000000002, 180, 16775, 5610.5, 11318.5, 13780.0, 16746.829999999987, 1.474208718470361, 0.906911896680082, 1.3678612594533635], "isController": false}, {"data": ["GET\/user-book-statuses", 100, 2, 2.0, 10592.539999999997, 227, 22533, 9328.0, 18062.5, 19537.35, 22512.21999999999, 1.8499334023975138, 19.332291830462854, 1.6120073974211928], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/chapters.json", 100, 0, 0.0, 401.47, 252, 1667, 317.5, 451.8, 1271.6999999999985, 1666.4899999999998, 1.4737307493920861, 3.801577697848353, 0.8763229036180089], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 1, 1.0, 3821.1600000000008, 212, 9059, 4147.5, 8118.3, 8730.65, 9057.66, 2.6450827910913612, 4.1492928123181505, 2.2193122867402], "isController": false}, {"data": ["GET\/annotations2", 100, 4, 4.0, 2594.5800000000004, 166, 9505, 634.0, 6744.0, 7335.2, 9502.929999999998, 1.4542704652211218, 2.4675731770719715, 1.3493755271730434], "isController": false}, {"data": ["GET\/otps\/checkuser\/PHONE_NUM", 100, 0, 0.0, 547.2399999999999, 89, 1965, 400.5, 1329.0, 1440.3999999999999, 1962.3199999999986, 4.648568240981778, 6.096297633297694, 2.6420573400892526], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json", 100, 0, 0.0, 316.8599999999999, 187, 1277, 263.0, 484.5000000000008, 524.0499999999997, 1276.92, 1.453615140855307, 3.843562847050615, 1.0478237110067739], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json", 100, 0, 0.0, 159.28999999999996, 80, 1140, 118.0, 165.9, 483.0999999999964, 1139.2899999999997, 1.4791805339841728, 2.40544511777975, 1.0662378198727904], "isController": false}, {"data": ["OPTIONS\/annotations?chapter=CHAPTER_ID&book_id=BOOK_IDusers_permissions_user=USERPERMS", 100, 0, 0.0, 400.09999999999997, 153, 1785, 230.0, 1050.7, 1198.6999999999998, 1779.9699999999975, 1.4732965009208103, 0.6273020257826888, 0.9348526703499079], "isController": false}, {"data": ["OPTIONS\/annotations?chapter=CHAPTER_ID2&book_id=BOOK_ID&users_permissions_user=USERPERMS", 100, 2, 2.0, 206.25000000000009, 1, 960, 67.0, 673.1, 717.6499999999999, 958.6499999999993, 1.4571524327159866, 0.6661207278112113, 0.9061239790825769], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 100, 1, 1.0, 18169.899999999994, 231, 25728, 19374.0, 24019.1, 25372.74999999999, 25727.37, 1.4781310510989905, 23.049057552880136, 1.2620121243699465], "isController": false}, {"data": ["GET\/Login", 100, 0, 0.0, 585.3499999999999, 221, 1411, 473.5, 1102.9000000000005, 1185.55, 1410.2299999999996, 4.823461315840246, 8.68175932736832, 2.6236991727763845], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502\/Proxy Error", 8, 53.333333333333336, 0.6153846153846154], "isController": false}, {"data": ["401\/Unauthorized", 5, 33.333333333333336, 0.38461538461538464], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, 13.333333333333334, 0.15384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 15, "502\/Proxy Error", 8, "401\/Unauthorized", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST\/otps\/loginWithPassword", 100, 1, "502\/Proxy Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GET\/annotations", 100, 4, "502\/Proxy Error", 3, "401\/Unauthorized", 1, null, null, null, null, null, null], "isController": false}, {"data": ["GET\/user-book-statuses", 100, 2, "502\/Proxy Error", 1, "401\/Unauthorized", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 100, 1, "401\/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GET\/annotations2", 100, 4, "502\/Proxy Error", 3, "401\/Unauthorized", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OPTIONS\/annotations?chapter=CHAPTER_ID2&book_id=BOOK_ID&users_permissions_user=USERPERMS", 100, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: qaapi.onelern.school:443 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 100, 1, "401\/Unauthorized", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
