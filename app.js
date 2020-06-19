google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart1);
google.charts.setOnLoadCallback(drawChart2);

var from;
var to;

window.onload = function () {
  this.document.getElementById("date_div").style.display = "none";
  this.document.getElementById("date_div_2").style.display = "none";
};

function getvalue() {
  var val;
  var date = new Date();
  console.log(this.document.getElementById("filter_1").value);
  if (this.document.getElementById("filter_1").value == "datewise") {
    this.document.getElementById("date_div").style.display = "flex";
  } else if (this.document.getElementById("filter_1").value == "thisweek") {
    from = date - 7;
    to = date;
    drawChart1(from, to);
    this.document.getElementById("filter_2").value == "thisweek";
  } else if (this.document.getElementById("filter_1").value == "thismonth") {
    from = date - 30;
    to = date;
    drawChart1(from, to);
    this.document.getElementById("filter_2").value == "thismonth";
  } else {
    this.document.getElementById("date_div").style.display = "none";
    drawChart1(0, 0);
  }
  
}

function getvalue2() {
  var val;
  var date = new Date();
  console.log(this.document.getElementById("filter_2").value);
  if (this.document.getElementById("filter_2").value == "datewise") {
    this.document.getElementById("date_div_2").style.display = "flex";
  } else if (this.document.getElementById("filter_2").value == "thisweek") {
    from = date - 7;
    to = date;
    drawChart2(from, to);
  } else if (this.document.getElementById("filter_2").value == "thismonth") {
    from = date - 30;
    to = date;
    drawChart2(from, to);
  } else {
    this.document.getElementById("date_div_2").style.display = "none";
    drawChart2(0, 0);
  }
 
}

function getDate1() {
  var date = new Date();
  if (
    this.document.getElementById("fromdate1").value != null &&
    this.document.getElementById("todate1").value != null
  ) {
    if (this.document.getElementById("todate1").value <= date) {
      if (
        this.document.getElementById("todate1").value -
          this.document.getElementById("fromdate1").value <
        8
      ) {
        from = this.document.getElementById("fromdate1").value;
        to = this.document.getElementById("todate1").valule;
      }
    }
  }
  drawChart1(from, to);
}

function getDate2() {
  var date = new Date();
  if (
    this.document.getElementById("fromdate1").value != null &&
    this.document.getElementById("todate1").value != null
  ) {
    if (this.document.getElementById("todate1").value <= date) {
      if (
        this.document.getElementById("todate1").value -
          this.document.getElementById("fromdate1").value <
        8
      ) {
        from = this.document.getElementById("fromdate1").value;
        to = this.document.getElementById("todate1").valule;
      }
    }
  }
  drawChart2(from, to);
}

function drawChart1(datefrom, dateto) {
  var report;
  var reportdata;
  var top_visited_array = [];
  var array_hours = [];
  var date = new Date();

  
  var jsonData = fetch("reportdata.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      report = data;
      if(datefrom && dateto){
        reportdata = report.filter(function (response) {
          return (response.req_date > datefrom && response.req_date < dateto);
        });
      }
      else{
        reportdata = report;
      }
      var dataMapReqd = transformToMap(reportdata);
      console.log("data", dataMapReqd);
      var data_array = [...dataMapReqd.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );
      var topFivedata = data_array.slice(0, 5);
      var top_visited_hours = hoursvisited(reportdata);

      top_visited_array = [...top_visited_hours.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );

      for (i = 0; i < topFivedata.length; i++) {
        for (j = 0; j < top_visited_array.length; j++) {
          if (topFivedata[i][0] == top_visited_array[j][0]) {
            array_hours.push([topFivedata[i][0], top_visited_array[j][1]]);
          }
        }
      }

      var data = new google.visualization.DataTable();
      

      data.addColumn("string", "Domain");
      data.addColumn("number", "visits");
      data.addRows(topFivedata);
      header_array = ["Sites", "Hours Spent"];

      var table = document.createElement("table");
      table.className = "table";
      var head = table.insertRow(-1);
      for (var i = 0; i < 2; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = header_array[i];
        head.appendChild(headerCell);
      }
      for (let row of array_hours) {
        table.insertRow();
        for (let cell of row) {
          let newCell = table.rows[table.rows.length - 1].insertCell();
          newCell.textContent = cell;
        }
      }

      var dvtable = document.getElementById("divtable");
      dvtable.innerHTML = "";
      dvtable.appendChild(table);

       var options = {
        title: "Most visited sites : ",
        pieHole: 0.4,
        legend: {
          position: "labeled",
          alignment: "end",
        },
        enableInteractivity: false,
      };

      var chart = new google.visualization.PieChart(
        document.getElementById("donutchart")
      );
      chart.draw(data, options);

      
    });
}

function drawChart2(datefrom, dateto){

  var array_block_hours = [];
  var report;
  var reportdata;
  var top_visited_array = [];
  var date = new Date();
  var jsonData = fetch("reportdata.json")
    .then(function (resp) {
      return resp.json();
    }).then(function (data) {
      report = data;
      if(datefrom && dateto){
        reportdata = report.filter(function (response) {
          return (response.req_date > datefrom && response.req_date < dateto);
        });
      }
      else{
        reportdata = report;
      }

      var blockedmapreqd = blockedsitemap(reportdata);

      var blocked_array = [...blockedmapreqd.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );
      var top_visited_hours = hoursvisited(reportdata);

      top_visited_array = [...top_visited_hours.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
        );
      var topblockedsite = blocked_array.slice(0, 5);
      for (i = 0; i < topblockedsite.length; i++) {
        for (j = 0; j < top_visited_array.length; j++) {
          if (topblockedsite[i][0] == top_visited_array[j][0]) {
            array_block_hours.push([
              topblockedsite[i][0],
              top_visited_array[j][1],
            ]);
          }
        }
      }
      var data2 = new google.visualization.DataTable();
      data2.addColumn("string", "Doamin");
      data2.addColumn("number", "block_rate");
      data2.addRows(topblockedsite);
      header_array = ["Sites", "Hours Spent"];
      var table2 = document.createElement("table");
      table2.className = "table";
      var head2 = table2.insertRow(-1);
      for (var i = 0; i < 2; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = header_array[i];
        head2.appendChild(headerCell);
      }
      for (let row of array_block_hours) {
        table2.insertRow();
        for (let cell of row) {
          let newCell = table2.rows[table2.rows.length - 1].insertCell();
          newCell.textContent = cell;
        }
      }

      var divtable = document.getElementById("divtable2");
      divtable.innerHTML = "";
      divtable.appendChild(table2);

      var options2 = {
        title: "Blocked sites : ",
        pieHole: 0.4,
        legend: {
          position: "labeled",
          alignment: "end",
        },
        enableInteractivity: false,
      };

      var chart = new google.visualization.PieChart(
        document.getElementById("donutchart2")
      );
      chart.draw(data2, options2);

    });
}

// Instantiate and draw our chart, passing in some options

function blockedsitemap(data) {
  var returnMap = new Map();

  data.forEach((element) => {
    if (!returnMap.get(element.domain)) {
      returnMap.set(element.domain, element.all_dom_checks);
    } else {
      returnMap.set(
        element.domain,
        Number(returnMap.get(element.domain) + element.all_dom_checks)
      );
    }
  });

  return returnMap;
}

function transformToMap(data) {
  var returnMap = new Map();

  data.forEach((element) => {
    if (!returnMap.get(element.domain)) {
      returnMap.set(element.domain, element.visits);
    } else {
      returnMap.set(
        element.domain,
        Number(returnMap.get(element.domain) + element.visits)
      );
    }
  });

  return returnMap;
}

function hoursvisited(data) {
  var returnMap = new Map();

  data.forEach((element) => {
    if (!returnMap.get(element.v_span_hr)) {
      returnMap.set(
        element.domain,
        Math.ceil(element.v_span_hr + element.v_span_min / 60)
      );
    } else {
      returnMap.set(
        element.domain,
        Number(
          returnMap.get(element.domain) +
            Math.ceil(element.v_span_hr + element.v_span_min / 60)
        )
      );
    }
  });

  return returnMap;
}
