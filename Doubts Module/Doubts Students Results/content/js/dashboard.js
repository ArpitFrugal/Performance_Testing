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

    var data = {"OkPercent": 99.84813971146545, "KoPercent": 0.15186028853454822};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6514806378132119, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST/otps/loginWithPassword"], "isController": false}, {"data": [0.9635416666666666, 500, 1500, "PUT/doubts/DOUBT_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/userDetails/USER_PERM"], "isController": false}, {"data": [0.8367346938775511, 500, 1500, "OPTIONS/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/doubts/DOUBT_id"], "isController": false}, {"data": [0.8383838383838383, 500, 1500, "OPTIONS/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/nodes/getrole?type=teacher"], "isController": false}, {"data": [1.0, 500, 1500, "POST/doubts"], "isController": false}, {"data": [0.005154639175257732, 500, 1500, "POST/license-assignments/userbooksBasedOnLicence"], "isController": false}, {"data": [0.828125, 500, 1500, "OPTIONS/doubts?grade=GRADE&subject=SUB_1&subject=SUB_2&subject=SUB_3&subject=SUB_4&subject=SUB_5&subject=SUB_6&_sort=created_At:DESC"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "OPTIONS/modulesByRoleandInstitution/NODE_ID/ROLE_ID"], "isController": false}, {"data": [0.0, 500, 1500, "GET/user-book-statuses"], "isController": false}, {"data": [0.5364583333333334, 500, 1500, "GET/BOOK_VERSION/books/SUB/CHAPTER/sections.json"], "isController": false}, {"data": [1.0, 500, 1500, "GET/student-doubts"], "isController": false}, {"data": [0.8645833333333334, 500, 1500, "GET/doubts/DOUBT_ID"], "isController": false}, {"data": [0.25757575757575757, 500, 1500, "GET/modulesByRoleandInstitution/NODE_ID/ROLE_ID"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/license-assignments/userbooksBasedOnLicence"], "isController": false}, {"data": [1.0, 500, 1500, "POST/events"], "isController": false}, {"data": [0.84375, 500, 1500, "OPTIONS/doubts"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "GET/BOOK_VERSION/books/SUB_1/chapters.json"], "isController": false}, {"data": [0.13917525773195877, 500, 1500, "GET/usernodesbyrole"], "isController": false}, {"data": [0.305, 500, 1500, "GET/otps/checkuser/phone_num"], "isController": false}, {"data": [0.5204081632653061, 500, 1500, "GET/nodes/getrole"], "isController": false}, {"data": [0.595, 500, 1500, "GET/IP"], "isController": false}, {"data": [1.0, 500, 1500, "OPTIONS/events"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "GET/userDetails/USER_PERM"], "isController": false}, {"data": [0.4375, 500, 1500, "GET/doubts"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2634, 4, 0.15186028853454822, 1837.8359908883772, 43, 21049, 260.0, 6548.0, 8838.75, 12130.350000000019, 18.35130841902851, 317.9286810824415, 15.231890253567148], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST/otps/loginWithPassword", 99, 0, 0.0, 7143.89898989899, 2338, 12992, 5828.0, 11665.0, 12001.0, 12992.0, 2.932811944543192, 542.4406031520323, 1.9704830252399572], "isController": false}, {"data": ["PUT/doubts/DOUBT_ID", 96, 0, 0.0, 186.31249999999997, 84, 780, 116.0, 393.5, 633.6999999999994, 780.0, 3.137562506128052, 6.40745263015982, 9.916847444193875], "isController": false}, {"data": ["OPTIONS/userDetails/USER_PERM", 99, 0, 0.0, 56.888888888888886, 47, 103, 55.0, 70.0, 71.0, 103.0, 2.341975775927328, 0.9948822876253786, 1.315074288240443], "isController": false}, {"data": ["OPTIONS/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES", 98, 1, 1.0204081632653061, 810.0918367346935, 155, 21046, 194.5, 1203.9, 3196.6, 21046.0, 2.7609522467953234, 1.245031210381744, 1.6412687966615018], "isController": false}, {"data": ["OPTIONS/doubts/DOUBT_id", 96, 0, 0.0, 62.7083333333333, 47, 236, 52.0, 95.39999999999998, 128.64999999999992, 236.0, 3.1407446182032324, 1.334203036053131, 1.7482660472420337], "isController": false}, {"data": ["OPTIONS/user-book-statuses?users_permissions_user=PERM_ID&continuereading=true&_sort=updatedAt:DESC-69", 99, 0, 0.0, 627.5858585858587, 165, 7187, 249.0, 1263.0, 3198.0, 7187.0, 3.0738659297668205, 1.3087944779085292, 1.9061570951190734], "isController": false}, {"data": ["OPTIONS/nodes/getrole?type=teacher", 98, 0, 0.0, 61.224489795918366, 48, 109, 57.0, 83.0, 90.29999999999998, 109.0, 2.5912215758857746, 1.100763071787414, 1.4297267484135379], "isController": false}, {"data": ["POST/doubts", 96, 0, 0.0, 121.63541666666663, 60, 443, 73.0, 254.89999999999992, 367.6499999999999, 443.0, 3.1243897676235113, 4.015615083723882, 4.713759061950791], "isController": false}, {"data": ["POST/license-assignments/userbooksBasedOnLicence", 97, 0, 0.0, 7858.597938144329, 944, 14942, 7344.0, 12776.8, 13552.099999999999, 14942.0, 2.871181624437604, 42.564643211283446, 2.4954605915522143], "isController": false}, {"data": ["OPTIONS/doubts?grade=GRADE&subject=SUB_1&subject=SUB_2&subject=SUB_3&subject=SUB_4&subject=SUB_5&subject=SUB_6&_sort=created_At:DESC", 96, 0, 0.0, 684.9270833333335, 159, 7413, 197.5, 1231.6, 3230.45, 7413.0, 3.7793787646155663, 1.6091886146214716, 2.880438393173497], "isController": false}, {"data": ["OPTIONS/modulesByRoleandInstitution/NODE_ID/ROLE_ID", 99, 0, 0.0, 545.8585858585858, 165, 7182, 213.0, 1212.0, 1391.0, 7182.0, 3.0772099962700485, 1.3102183187243568, 1.8150730837374116], "isController": false}, {"data": ["GET/user-book-statuses", 99, 0, 0.0, 8022.747474747474, 2631, 13927, 8332.0, 10987.0, 11947.0, 13927.0, 2.7136670138698533, 28.616530926210185, 2.374458637136122], "isController": false}, {"data": ["GET/BOOK_VERSION/books/SUB/CHAPTER/sections.json", 96, 0, 0.0, 554.3958333333333, 477, 658, 555.0, 605.6, 619.3, 658.0, 4.1184041184041185, 1.1100386100386102, 3.003547632453883], "isController": false}, {"data": ["GET/student-doubts", 99, 0, 0.0, 94.66666666666669, 43, 403, 73.0, 142.0, 152.0, 403.0, 2.3208383149307266, 3.236161049183018, 2.05793084956748], "isController": false}, {"data": ["GET/doubts/DOUBT_ID", 96, 0, 0.0, 531.5625, 171, 3203, 215.5, 1217.9, 1597.399999999984, 3203.0, 3.126526624328285, 6.387332580198665, 2.53114313629702], "isController": false}, {"data": ["GET/modulesByRoleandInstitution/NODE_ID/ROLE_ID", 99, 0, 0.0, 3819.1111111111104, 179, 13015, 4465.0, 6652.0, 8689.0, 13015.0, 2.1179188772890636, 3.0143198525479207, 1.784925772559045], "isController": false}, {"data": ["OPTIONS/license-assignments/userbooksBasedOnLicence", 98, 0, 0.0, 58.53061224489797, 47, 136, 56.0, 72.0, 83.14999999999999, 136.0, 2.5861613975827304, 1.0986134843246953, 1.4723946238190744], "isController": false}, {"data": ["POST/events", 96, 0, 0.0, 125.74999999999999, 63, 494, 85.5, 263.29999999999995, 349.1999999999994, 494.0, 3.140333660451423, 2.6195003271180894, 3.290188246238142], "isController": false}, {"data": ["OPTIONS/doubts", 96, 0, 0.0, 650.6979166666667, 156, 15198, 181.0, 1195.3, 1246.3999999999999, 15198.0, 3.0193426639408716, 1.285579493631074, 1.6099229438590972], "isController": false}, {"data": ["GET/BOOK_VERSION/books/SUB_1/chapters.json", 96, 0, 0.0, 723.4999999999999, 599, 1692, 680.0, 749.9, 905.7999999999926, 1692.0, 4.081285604965564, 5.734367360874926, 2.4944649556797893], "isController": false}, {"data": ["GET/usernodesbyrole", 97, 1, 1.0309278350515463, 4002.608247422681, 408, 21030, 3428.0, 7328.0, 8337.5, 21030.0, 2.157473309608541, 240.54550225200177, 1.8224532918149465], "isController": false}, {"data": ["GET/otps/checkuser/phone_num", 100, 1, 1.0, 3549.0499999999997, 257, 10315, 2729.5, 7915.6, 8348.249999999996, 10310.769999999999, 3.51271603203597, 23.46298777355276, 2.0033458620205145], "isController": false}, {"data": ["GET/nodes/getrole", 98, 0, 0.0, 2109.438775510204, 63, 7270, 964.5, 7097.6, 7213.1, 7270.0, 2.3915271609156132, 1.3549095703792278, 1.9244320122992824], "isController": false}, {"data": ["GET/IP", 100, 0, 0.0, 1236.7599999999998, 170, 6054, 284.0, 3993.7000000000007, 4287.65, 6039.119999999993, 4.26003237624606, 7.668307888514953, 2.3255450178921357], "isController": false}, {"data": ["OPTIONS/events", 96, 0, 0.0, 59.54166666666667, 47, 165, 51.0, 79.09999999999998, 110.64999999999974, 165.0, 3.143315543040503, 1.3352951769752137, 1.676025670410268], "isController": false}, {"data": ["GET/userDetails/USER_PERM", 99, 1, 1.0101010101010102, 4188.484848484848, 236, 21049, 3630.0, 8245.0, 10465.0, 21049.0, 2.2463751673436048, 17.71464564991718, 1.8110867974404938], "isController": false}, {"data": ["GET/doubts", 96, 0, 0.0, 1387.1666666666672, 301, 5656, 720.0, 3119.499999999999, 3555.8499999999995, 5656.0, 3.558059375115822, 403.57128482774914, 3.618648887179867], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school/13.251.97.56] failed: Connection timed out: connect", 3, 75.0, 0.11389521640091116], "isController": false}, {"data": ["502/Proxy Error", 1, 25.0, 0.037965072133637055], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2634, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school/13.251.97.56] failed: Connection timed out: connect", 3, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OPTIONS/usernodesbyrole?role=USER_ROLE&nodes=USER_NODES", 98, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school/13.251.97.56] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET/usernodesbyrole", 97, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school/13.251.97.56] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET/otps/checkuser/phone_num", 100, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET/userDetails/USER_PERM", 99, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to qaapi.onelern.school:443 [qaapi.onelern.school/13.251.97.56] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
