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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6945652173913044, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.325, 500, 1500, "POST\/otps\/loginWithPassword"], "isController": false}, {"data": [0.55, 500, 1500, "GET\/groupbynodeuser\/"], "isController": false}, {"data": [0.325, 500, 1500, "GET\/nodes?_sort=ASC&node_type=node.type&parent_id=node_id"], "isController": false}, {"data": [0.45, 500, 1500, "GET\/getStudentsList?ROLE=STUDENT_LIST_NODE_ID&NODES=STUDENT_LIST_NODE_ID&_start=0&_limit=-1"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/groups"], "isController": false}, {"data": [0.85, 500, 1500, "GET\/node-types?slug-grades"], "isController": false}, {"data": [0.75, 500, 1500, "GET\/getgradelist\/PARENT_ID"], "isController": false}, {"data": [0.775, 500, 1500, "GET\/otps\/checkuser\/PHONE_NUM"], "isController": false}, {"data": [0.7, 500, 1500, "POST\/groups"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.025, 500, 1500, "GET\/nodes?NODE_TYPE_ID"], "isController": false}, {"data": [0.95, 500, 1500, "GET\/groups"], "isController": false}, {"data": [0.95, 500, 1500, "GET\/build\/bundle.js"], "isController": false}, {"data": [0.925, 500, 1500, "GET\/URL"], "isController": false}, {"data": [0.65, 500, 1500, "GET\/modulesByRoleandInstitution\/"], "isController": false}, {"data": [0.975, 500, 1500, "GET\/node-types?Slug-Sections"], "isController": false}, {"data": [0.8, 500, 1500, "GET\/getusercount\/STUDENT_LIST_ROLE_ID\/sTUDNT_LIST_NODE_ID"], "isController": false}, {"data": [0.8, 500, 1500, "GET\/IP"], "isController": false}, {"data": [0.325, 500, 1500, "GET\/nodes?SORT:ASC&NODE_TYPE_ID = NODE_TYPE & PARENT_ID - OBJECT PROMISE"], "isController": false}, {"data": [0.65, 500, 1500, "GET\/node-types?Slug - centers"], "isController": false}, {"data": [0.8, 500, 1500, "GET\/node-types?Slug=institutions"], "isController": false}, {"data": [0.4, 500, 1500, "GET\/users\/USER_PERM"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/teacher"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 460, 0, 0.0, 726.4739130434789, 0, 5188, 478.5, 1788.5000000000005, 2239.0, 3410.6299999999997, 18.135225704711218, 283.5814683742362, 17.114195249359355], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["POST\/otps\/loginWithPassword", 20, 0, 0.0, 1574.8, 436, 3499, 1300.0, 3419.3, 3495.1, 3499.0, 2.5552574421873, 20.76508500223585, 1.7118228567778204], "isController": false}, {"data": ["GET\/groupbynodeuser\/", 20, 0, 0.0, 1255.8000000000004, 329, 3034, 1271.0, 2971.8, 3030.95, 3034.0, 3.078817733990148, 16.387638787330665, 2.594745805110837], "isController": false}, {"data": ["GET\/nodes?_sort=ASC&node_type=node.type&parent_id=node_id", 20, 0, 0.0, 1391.0999999999997, 360, 2247, 1394.0, 2129.1, 2241.15, 2247.0, 4.859086491739553, 11.301409514698738, 4.308643100097182], "isController": false}, {"data": ["GET\/getStudentsList?ROLE=STUDENT_LIST_NODE_ID&NODES=STUDENT_LIST_NODE_ID&_start=0&_limit=-1", 20, 0, 0.0, 1229.85, 580, 1738, 1266.0, 1506.3000000000002, 1726.6999999999998, 1738.0, 3.3800912624640866, 275.2188146970593, 2.9476772435355754], "isController": false}, {"data": ["OPTIONS\/groups", 20, 0, 0.0, 85.45, 46, 268, 62.0, 232.8000000000002, 266.75, 268.0, 4.089143324473523, 1.737087252095686, 2.1803439991821714], "isController": false}, {"data": ["GET\/node-types?slug-grades", 20, 0, 0.0, 334.6000000000001, 74, 626, 307.0, 591.6, 624.3, 626.0, 8.257638315441783, 5.578341117877787, 6.7254593311312965], "isController": false}, {"data": ["GET\/getgradelist\/PARENT_ID", 20, 0, 0.0, 535.2499999999999, 74, 1655, 394.5, 851.8, 1614.8499999999995, 1655.0, 4.8744820862783325, 2.1313958536436757, 3.974797404338289], "isController": false}, {"data": ["GET\/otps\/checkuser\/PHONE_NUM", 20, 0, 0.0, 506.1, 102, 2149, 447.0, 1073.900000000001, 2097.5499999999993, 2149.0, 3.2399157621901833, 4.978206504130893, 1.841436497651061], "isController": false}, {"data": ["POST\/groups", 20, 0, 0.0, 706.0000000000002, 157, 1259, 897.5, 1187.5000000000002, 1256.0, 1259.0, 3.9603960396039604, 20.085086633663366, 22.47447400990099], "isController": false}, {"data": ["Debug Sampler", 20, 0, 0.0, 0.6, 0, 1, 1.0, 1.0, 1.0, 1.0, 5.098139179199593, 11.806623199719603, 0.0], "isController": false}, {"data": ["GET\/nodes?NODE_TYPE_ID", 20, 0, 0.0, 1937.9999999999998, 1210, 2685, 1960.5, 2579.5000000000005, 2680.9, 2685.0, 2.7012425715829282, 3.694160251215559, 2.350397589141005], "isController": false}, {"data": ["GET\/groups", 20, 0, 0.0, 228.85, 88, 664, 179.0, 627.5000000000007, 663.9, 664.0, 2.74310794129749, 2.7385539535043204, 2.4082558976820736], "isController": false}, {"data": ["GET\/build\/bundle.js", 20, 0, 0.0, 158.4, 24, 554, 48.5, 544.0000000000002, 553.95, 554.0, 2.987750224081267, 169.58414835113535, 1.660185427248282], "isController": false}, {"data": ["GET\/URL", 20, 0, 0.0, 300.04999999999995, 101, 1011, 194.5, 899.8000000000006, 1006.8, 1011.0, 4.109307581672488, 11.14127992089583, 2.6646291349907543], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/", 20, 0, 0.0, 754.5, 328, 2354, 535.0, 2080.9000000000024, 2345.5499999999997, 2354.0, 2.596391016487083, 5.012885604634557, 2.1830983058548616], "isController": false}, {"data": ["GET\/node-types?Slug-Sections", 20, 0, 0.0, 278.15, 66, 573, 312.0, 482.9, 568.5, 573.0, 10.090817356205854, 6.84579181382442, 8.248060671039354], "isController": false}, {"data": ["GET\/getusercount\/STUDENT_LIST_ROLE_ID\/sTUDNT_LIST_NODE_ID", 20, 0, 0.0, 532.6499999999999, 342, 847, 424.5, 832.3000000000001, 846.4, 847.0, 3.717472118959108, 1.6263940520446096, 3.122095724907063], "isController": false}, {"data": ["GET\/IP", 20, 0, 0.0, 512.1, 237, 1262, 426.5, 1188.4000000000003, 1259.1, 1262.0, 4.684937924572499, 8.436090858514875, 2.5483500234246894], "isController": false}, {"data": ["GET\/nodes?SORT:ASC&NODE_TYPE_ID = NODE_TYPE & PARENT_ID - OBJECT PROMISE", 20, 0, 0.0, 1406.65, 556, 2220, 1331.5, 2061.0, 2212.25, 2220.0, 3.2252862441541685, 1.4135824866956943, 2.8473230124173523], "isController": false}, {"data": ["GET\/node-types?Slug - centers", 20, 0, 0.0, 857.1999999999998, 105, 2586, 460.5, 2539.1000000000004, 2584.1, 2586.0, 4.068348250610253, 2.7574581087266066, 3.321424938974776], "isController": false}, {"data": ["GET\/node-types?Slug=institutions", 20, 0, 0.0, 417.0, 164, 766, 255.5, 739.3000000000001, 764.6999999999999, 766.0, 8.631851532153647, 5.887192490289166, 7.080815709969788], "isController": false}, {"data": ["GET\/users\/USER_PERM", 20, 0, 0.0, 1564.55, 478, 5188, 1085.0, 3639.5000000000014, 5113.549999999999, 5188.0, 3.2701111837802483, 591.2335472531066, 2.6441914650098104], "isController": false}, {"data": ["GET\/teacher", 20, 0, 0.0, 141.25, 46, 227, 112.5, 226.0, 226.95, 227.0, 4.819277108433735, 13.063582454819276, 3.3979668674698793], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 460, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
