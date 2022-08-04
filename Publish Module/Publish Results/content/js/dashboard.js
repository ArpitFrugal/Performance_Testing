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

    var data = {"OkPercent": 99.54545454545455, "KoPercent": 0.45454545454545453};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6090909090909091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.55, 500, 1500, "GET/otps/checkuser/PHONE"], "isController": false}, {"data": [0.15, 500, 1500, "POST/otps/loginWithPassword"], "isController": false}, {"data": [0.75, 500, 1500, "GET/grades/Subjects?CURRICULUM"], "isController": false}, {"data": [0.5, 500, 1500, "GET/book_version/books/SUBJECT/chapters.json"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 9"], "isController": false}, {"data": [0.35, 500, 1500, "GET/teacher-publish-contents?CREATEDBY&STATUS&_LIMIT"], "isController": false}, {"data": [0.1, 500, 1500, "POST/teacher-publish-contents"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 6"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 20"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 5"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 8"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 7"], "isController": false}, {"data": [0.7, 500, 1500, "PUT/teacher-publish-contents/TEACHER_PUBLISH_ID"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 2"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 4"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 3"], "isController": false}, {"data": [0.975, 500, 1500, "GET/teacher-publish-contents/TEACHER_PUBLISH_ID"], "isController": false}, {"data": [0.0, 500, 1500, "POST/license-assignments/userbooksBasedOnLicence"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 19"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 18"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 17"], "isController": false}, {"data": [0.55, 500, 1500, "POST/UserDetailsByNodesAndRole -2"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 16"], "isController": false}, {"data": [0.625, 500, 1500, "POST/UserDetailsByNodesAndRole -1"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/teacher-publish-contents/TEACHER_PUBLISH_ID"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 15"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 14"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 13"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 12"], "isController": false}, {"data": [0.55, 500, 1500, "GET/modulesByRoleandInstitution"], "isController": false}, {"data": [1.0, 500, 1500, "GET/content-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 11"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler 10"], "isController": false}, {"data": [0.225, 500, 1500, "POST/publishes"], "isController": false}, {"data": [0.575, 500, 1500, "GET/userDetails/USER_ID"], "isController": false}, {"data": [0.95, 500, 1500, "GET/signin"], "isController": false}, {"data": [0.0, 500, 1500, "GET/groups"], "isController": false}, {"data": [0.85, 500, 1500, "GET/nodes/getrole"], "isController": false}, {"data": [1.0, 500, 1500, "GET/IP"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/groups?createdBy.id=USERID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 440, 2, 0.45454545454545453, 4164.549999999997, 0, 77723, 631.5, 4519.600000000002, 36512.2, 59092.69999999924, 3.3095646418148448, 154.66614531621386, 6.700450728386286], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET/otps/checkuser/PHONE", 20, 0, 0.0, 932.55, 310, 1925, 873.5, 1551.2000000000005, 1907.5499999999997, 1925.0, 4.182350480970306, 586.3316375209117, 2.377078105395232], "isController": false}, {"data": ["POST/otps/loginWithPassword", 20, 0, 0.0, 1690.7500000000002, 465, 2995, 1793.0, 2497.0000000000005, 2971.2999999999997, 2995.0, 3.287851389117212, 461.79911613307576, 2.202603567318757], "isController": false}, {"data": ["GET/grades/Subjects?CURRICULUM", 20, 0, 0.0, 690.25, 91, 2343, 364.0, 1543.6000000000006, 2304.4999999999995, 2343.0, 2.2338880822070815, 27.899822336088462, 1.8564831620685804], "isController": false}, {"data": ["GET/book_version/books/SUBJECT/chapters.json", 20, 0, 0.0, 656.1000000000001, 614, 723, 652.0, 711.7, 722.5, 723.0, 1.6070711128967456, 2.986735385697067, 0.9887253917235838], "isController": false}, {"data": ["Debug Sampler 9", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3346.19140625, 0.0], "isController": false}, {"data": ["GET/teacher-publish-contents?CREATEDBY&STATUS&_LIMIT", 20, 2, 10.0, 2285.35, 267, 6183, 2609.0, 4261.6, 6087.149999999999, 6183.0, 1.376936316695353, 436.7938495051635, 1.1913726333907058], "isController": false}, {"data": ["POST/teacher-publish-contents", 20, 0, 0.0, 15510.550000000001, 283, 36078, 4452.0, 35999.1, 36074.95, 36078.0, 0.432816118072237, 0.8746351495379687, 0.5757003843948149], "isController": false}, {"data": ["Debug Sampler 6", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6672.8515625, 0.0], "isController": false}, {"data": ["Debug Sampler 20", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3326.66015625, 0.0], "isController": false}, {"data": ["Debug Sampler 5", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3292.48046875, 0.0], "isController": false}, {"data": ["Debug Sampler 8", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 1103.3528645833333, 0.0], "isController": false}, {"data": ["Debug Sampler 7", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6602.5390625, 0.0], "isController": false}, {"data": ["PUT/teacher-publish-contents/TEACHER_PUBLISH_ID", 20, 0, 0.0, 621.2500000000002, 310, 1380, 717.5, 774.9, 1349.7499999999995, 1380.0, 2.8149190710767065, 35.87028830928923, 69.55241687192118], "isController": false}, {"data": ["Debug Sampler 2", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6666.9921875, 0.0], "isController": false}, {"data": ["Debug Sampler 1", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3342.28515625, 0.0], "isController": false}, {"data": ["Debug Sampler 4", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6684.5703125, 0.0], "isController": false}, {"data": ["Debug Sampler 3", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3307.12890625, 0.0], "isController": false}, {"data": ["GET/teacher-publish-contents/TEACHER_PUBLISH_ID", 20, 0, 0.0, 396.40000000000003, 230, 508, 451.5, 493.90000000000003, 507.34999999999997, 508.0, 2.763576067431256, 64.68144388213348, 2.29128523559486], "isController": false}, {"data": ["POST/license-assignments/userbooksBasedOnLicence", 20, 0, 0.0, 3866.8, 1876, 5835, 3510.5, 5801.2, 5833.4, 5835.0, 1.6327863499061148, 24.220089395052657, 1.4223099844885296], "isController": false}, {"data": ["Debug Sampler 19", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6512.6953125, 0.0], "isController": false}, {"data": ["Debug Sampler 18", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6530.2734375, 0.0], "isController": false}, {"data": ["Debug Sampler 17", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1645.751953125, 0.0], "isController": false}, {"data": ["POST/UserDetailsByNodesAndRole -2", 20, 0, 0.0, 886.3500000000001, 431, 1213, 925.0, 1173.3000000000002, 1211.4, 1213.0, 0.47896161122686015, 85.25032573131452, 0.42470424120506745], "isController": false}, {"data": ["Debug Sampler 16", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["POST/UserDetailsByNodesAndRole -1", 20, 0, 0.0, 667.25, 342, 1110, 592.5, 1084.2000000000003, 1109.35, 1110.0, 0.48915303152591283, 38.446377363220584, 0.4509379509379509], "isController": false}, {"data": ["OPTIONS/teacher-publish-contents/TEACHER_PUBLISH_ID", 20, 0, 0.0, 61.800000000000004, 49, 83, 61.5, 71.80000000000001, 82.44999999999999, 83.0, 2.833663927458203, 1.2037537191839047, 1.632677458203457], "isController": false}, {"data": ["Debug Sampler 15", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6636.71875, 0.0], "isController": false}, {"data": ["Debug Sampler 14", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 3283.203125, 0.0], "isController": false}, {"data": ["Debug Sampler 13", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6671.875, 0.0], "isController": false}, {"data": ["Debug Sampler 12", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6641.6015625, 0.0], "isController": false}, {"data": ["GET/modulesByRoleandInstitution", 20, 0, 0.0, 972.2000000000002, 66, 1972, 1051.0, 1457.3000000000004, 1947.1499999999996, 1972.0, 3.0216044719746185, 5.834145782973259, 2.5406264163770964], "isController": false}, {"data": ["GET/content-dashboard", 20, 0, 0.0, 58.15, 30, 125, 51.0, 111.10000000000002, 124.35, 125.0, 3.157562361856647, 2.9423300836754027, 2.8091204215345753], "isController": false}, {"data": ["Debug Sampler 11", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1656.005859375, 0.0], "isController": false}, {"data": ["Debug Sampler 10", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 6659.1796875, 0.0], "isController": false}, {"data": ["POST/publishes", 20, 0, 0.0, 14853.450000000003, 546, 37375, 2030.5, 36497.4, 37332.6, 37375.0, 0.45110068567304223, 2.4903048594821366, 2.184137890202093], "isController": false}, {"data": ["GET/userDetails/USER_ID", 20, 0, 0.0, 971.1000000000001, 106, 1798, 1123.0, 1539.9, 1785.1499999999999, 1798.0, 2.977519726068185, 22.79547230906655, 2.4308657138603547], "isController": false}, {"data": ["GET/signin", 20, 0, 0.0, 215.64999999999998, 79, 847, 99.5, 673.2000000000005, 839.4999999999999, 847.0, 4.1017227235438884, 9.970510856747334, 3.0041914479081213], "isController": false}, {"data": ["GET/groups", 20, 0, 0.0, 45550.899999999994, 37287, 77723, 38501.5, 72516.5, 77465.09999999999, 77723.0, 0.24658480051289636, 19.235263957470284, 0.2032398160477388], "isController": false}, {"data": ["GET/nodes/getrole", 20, 0, 0.0, 492.79999999999995, 67, 2204, 233.0, 2183.8, 2203.8, 2204.0, 0.47384382107657314, 0.26827241725502277, 0.38222167598559514], "isController": false}, {"data": ["GET/IP", 20, 0, 0.0, 171.5, 153, 208, 165.0, 207.70000000000002, 208.0, 208.0, 4.757373929590866, 8.567918946241676, 2.587751248810657], "isController": false}, {"data": ["OPTIONS/groups?createdBy.id=USERID", 20, 0, 0.0, 67.15000000000002, 48, 195, 55.0, 92.4, 189.89999999999992, 195.0, 0.47838878656684286, 0.20322179898103188, 0.27329828138828427], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 2, 100.0, 0.45454545454545453], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 440, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET/teacher-publish-contents?CREATEDBY&STATUS&_LIMIT", 20, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
