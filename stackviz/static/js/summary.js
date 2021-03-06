/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/*
    <div class="col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading">Test Runs</div>
            <div class="panel-body" id="run-summary-div">

            </div>
        </div>
    </div>
*/

//@param data: JSON data of the test run
function getData(data) {

    var num_successes = 0;
    var num_failures = 0;
    var num_skipped = 0
    var total_time = 0;
    var longest_test={duration: 0};

    function calculateChildrenTime(i) {
        var dur = 0;
            if (typeof i.duration !== "undefined") {
                if (i.status=="success") num_successes++;
                else if (i.status=="fail") num_failures++;
                else if (i.status=="skip") num_skipped++;

                if (longest_test.duration < i.duration)
                    longest_test = i;

                dur = i.duration;
            }
            else {
                for (var k in i.children) {
                    dur += calculateChildrenTime(i.children[k]);
                }
            }
        return dur;
    }

    total_time=calculateChildrenTime(data);

    var data_dict= { "Successes": num_successes,
                    "Failures": num_failures,
                    "Skipped": num_skipped,
                    "Total Time": total_time.toFixed(2),
                    "Longest Test": longest_test.name + " ("+longest_test.duration+")"};

    return data_dict;
}


function createTable(data, entry) {
    var container = $("<div>")
            .addClass('col-lg-6' )
            .appendTo($("#run-summary-div"));
    
    var panel = $("<div>")
            .addClass('panel panel-default')
            .appendTo(container);
    
    var head = $("<div>")
            .addClass("panel-heading")
            .appendTo(panel);
    head.append($("<a>", {
        href: 'tempest_timeline_' + entry.provider + '_' + entry.run + '.html',
        text: entry.providerDescription + ", run #" + entry.run
    }));

    var body = $("<div>")
            .addClass("panel-body")
            .appendTo(panel);
    
    var table = $("<table>")
            .addClass("table table-bordered table-hover table-striped")
            .appendTo(body);

    var data_dict = getData(data);
    for (var key in data_dict) {
        $("<tr>")
                .append($("<td>").text(key))
                .append($("<td>").text(data_dict[key]))
                .appendTo(table);
    }
}


//@param run_id: The method is passed the latest run_id so it can populate the tables moving backwards
function createTables(entries) {
    entries.forEach(function(entry) {
        //TODO: Sort tables when inserting so they appear in correct order
        d3.json(entry.url, function(error, data) {
            if (error) throw error;
            //create a table for the info
            // TODO: entry now has provider description, etc which should be
            // shown (categorized?)
            createTable(data, entry);
        });
    })
}
