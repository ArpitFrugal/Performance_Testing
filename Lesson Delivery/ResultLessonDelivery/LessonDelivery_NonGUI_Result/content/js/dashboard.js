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

    var data = {"OkPercent": 99.8, "KoPercent": 0.2};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json-37"], "isController": false}, {"data": [0.925, 500, 1500, "OPTIONS\/assets?_where[0][referenceid]=CHAPTER_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/lessonplanStatus"], "isController": false}, {"data": [0.775, 500, 1500, "GET\/find-deep\/ASSESS_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/assets?_where[0][referenceid]=CHAPTER_ID2"], "isController": false}, {"data": [0.7, 500, 1500, "GET\/otps\/checkuser\/PHONE_NUM"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json"], "isController": false}, {"data": [0.675, 500, 1500, "GET\/find-deep\/ASSET_ID2"], "isController": false}, {"data": [0.025, 500, 1500, "POST\/license-assignments\/userbooksBasedOnLicence"], "isController": false}, {"data": [0.925, 500, 1500, "POST\/lessonplanStatus"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/find-deep\/ASSET_ID3"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/find-deep\/ASSET_ID2-65"], "isController": false}, {"data": [0.0, 500, 1500, "GET\/user-book-statuses"], "isController": false}, {"data": [0.9, 500, 1500, "GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST\/lessonplanStatus_ASSET_ID3"], "isController": false}, {"data": [0.25, 500, 1500, "POST\/otps\/loginWithPassword-9"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/lessondeliverytoc\/BOOK_ID\/v4\/CHAPTER_ID-38"], "isController": false}, {"data": [0.95, 500, 1500, "GET\/assets"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/assets2"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/find-deep\/ASSET_ID3"], "isController": false}, {"data": [0.6, 500, 1500, "GET\/signin"], "isController": false}, {"data": [1.0, 500, 1500, "GET\/v4\/books\/BOOK_ID\/chapters.json-36"], "isController": false}, {"data": [0.975, 500, 1500, "POST\/lessonplanStatus_PLANS"], "isController": false}, {"data": [0.725, 500, 1500, "GET\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS\/find-deep\/ASSET_ID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 500, 1, 0.2, 716.9159999999999, 47, 21030, 267.5, 2003.5000000000011, 3391.3499999999995, 6025.2300000000005, 8.511072905850511, 125.92908667144705, 6.212567902403527], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID\/sections.json-37", 20, 0, 0.0, 123.85, 102, 155, 118.5, 147.8, 154.65, 155.0, 2.3416461772626156, 3.813407387893689, 1.6883177467509658], "isController": false}, {"data": ["OPTIONS\/assets?_where[0][referenceid]=CHAPTER_ID", 20, 1, 5.0, 1325.5, 158, 21030, 240.5, 1137.600000000002, 20039.849999999988, 21030.0, 0.6840647125218046, 0.37282862896329994, 0.36745097179943226], "isController": false}, {"data": ["OPTIONS\/lessonplanStatus", 20, 0, 0.0, 100.35000000000001, 49, 284, 73.0, 244.20000000000007, 282.2, 284.0, 0.6543432030099787, 0.2779680598724031, 0.3463418125306723], "isController": false}, {"data": ["GET\/find-deep\/ASSESS_ID", 20, 0, 0.0, 708.9, 223, 1576, 414.0, 1466.3000000000002, 1570.75, 1576.0, 0.6470188605997865, 76.8701372488758, 0.5168568632525637], "isController": false}, {"data": ["OPTIONS\/assets?_where[0][referenceid]=CHAPTER_ID2", 20, 0, 0.0, 234.5, 160, 443, 221.5, 425.60000000000036, 443.0, 443.0, 0.6520817710540902, 0.27764419158162434, 0.36870639203156075], "isController": false}, {"data": ["GET\/otps\/checkuser\/PHONE_NUM", 20, 0, 0.0, 682.1500000000001, 136, 1342, 828.5, 1128.9, 1331.35, 1342.0, 3.58487184083169, 5.5077144761606025, 2.037495518910199], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/CHAPTER_ID2\/sections.json", 20, 0, 0.0, 267.40000000000003, 219, 349, 264.0, 342.5, 348.7, 349.0, 0.6509357200976403, 1.7484997965825875, 0.46932211147274205], "isController": false}, {"data": ["GET\/find-deep\/ASSET_ID2", 20, 0, 0.0, 835.1999999999999, 238, 1509, 781.5, 1475.4, 1507.65, 1509.0, 0.6550075325866247, 96.95045379740617, 0.5232384391170498], "isController": false}, {"data": ["POST\/license-assignments\/userbooksBasedOnLicence", 20, 0, 0.0, 4278.1, 1365, 6292, 3896.5, 6147.2, 6285.1, 6292.0, 1.4902019223604799, 23.45605476026377, 1.2748211757693169], "isController": false}, {"data": ["POST\/lessonplanStatus", 20, 0, 0.0, 218.3, 67, 561, 156.5, 558.4000000000001, 560.95, 561.0, 0.6543860223145633, 0.2859104554526715, 0.5719487206753264], "isController": false}, {"data": ["GET\/find-deep\/ASSET_ID3", 20, 0, 0.0, 220.6, 140, 351, 195.0, 334.40000000000003, 350.2, 351.0, 0.67310604785784, 15.11491182310773, 0.5376960421364386], "isController": false}, {"data": ["OPTIONS\/find-deep\/ASSET_ID2-65", 20, 0, 0.0, 70.75, 47, 216, 58.0, 119.70000000000009, 211.39999999999992, 216.0, 0.6605019815059445, 0.2805843378467635, 0.360566999669749], "isController": false}, {"data": ["GET\/user-book-statuses", 20, 0, 0.0, 3216.1499999999996, 1778, 5685, 3062.0, 5302.600000000002, 5670.95, 5685.0, 1.4436263894904, 21.775778881550455, 1.2603535080121266], "isController": false}, {"data": ["GET\/modulesByRoleandInstitution\/NODE_ID\/ROLE_ID", 20, 0, 0.0, 455.04999999999995, 224, 1094, 360.5, 889.2000000000002, 1084.1, 1094.0, 2.44081034903588, 4.71166974310471, 2.0522829204295823], "isController": false}, {"data": ["POST\/lessonplanStatus_ASSET_ID3", 20, 0, 0.0, 93.0, 67, 180, 83.0, 151.60000000000005, 178.7, 180.0, 0.6731740154830024, 0.304013011191518, 0.5883698670481319], "isController": false}, {"data": ["POST\/otps\/loginWithPassword-9", 20, 0, 0.0, 1965.8999999999999, 434, 3235, 1858.0, 2923.9, 3219.45, 3235.0, 2.390628735357399, 19.427243642421708, 1.6015344848195077], "isController": false}, {"data": ["GET\/lessondeliverytoc\/BOOK_ID\/v4\/CHAPTER_ID-38", 20, 0, 0.0, 251.29999999999998, 80, 376, 268.5, 348.0, 374.59999999999997, 376.0, 2.3342670401493932, 6.328849899334734, 2.2157300420168067], "isController": false}, {"data": ["GET\/assets", 20, 0, 0.0, 383.05, 114, 1378, 331.5, 785.3000000000006, 1349.9999999999995, 1378.0, 0.6577000230195008, 5.686247030073334, 0.5433732612055642], "isController": false}, {"data": ["GET\/assets2", 20, 0, 0.0, 185.7, 90, 454, 144.0, 299.8, 446.2999999999999, 454.0, 0.6553724153750369, 7.442444989677885, 0.541450257233673], "isController": false}, {"data": ["OPTIONS\/find-deep\/ASSET_ID3", 20, 0, 0.0, 55.55, 48, 79, 53.0, 76.30000000000004, 78.95, 79.0, 0.6765213273348443, 0.28738943104556375, 0.3693119355275175], "isController": false}, {"data": ["GET\/signin", 20, 0, 0.0, 884.2, 98, 2524, 681.5, 2234.7000000000007, 2510.7999999999997, 2524.0, 3.6989088218975406, 10.033651400961716, 2.5393875994081747], "isController": false}, {"data": ["GET\/v4\/books\/BOOK_ID\/chapters.json-36", 20, 0, 0.0, 344.54999999999995, 258, 426, 338.5, 401.3, 424.79999999999995, 426.0, 2.268602540834846, 5.904348273026315, 1.3491981907894737], "isController": false}, {"data": ["POST\/lessonplanStatus_PLANS", 20, 0, 0.0, 312.70000000000005, 181, 1215, 270.0, 394.1, 1173.9999999999995, 1215.0, 0.6734460233012325, 0.3383671669809415, 0.7798557562798841], "isController": false}, {"data": ["GET\/Login", 20, 0, 0.0, 624.85, 300, 2368, 473.5, 1094.4, 2304.399999999999, 2368.0, 4.060913705583757, 7.310239530456853, 2.2089149746192893], "isController": false}, {"data": ["OPTIONS\/find-deep\/ASSET_ID", 20, 0, 0.0, 85.3, 48, 150, 83.0, 136.9, 149.35, 150.0, 0.6656681644200366, 0.28277895656515223, 0.36338721085039105], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 1, 100.0, 0.2], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 500, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["OPTIONS\/assets?_where[0][referenceid]=CHAPTER_ID", 20, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school\\\/18.143.35.168] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
