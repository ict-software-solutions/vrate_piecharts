google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(getVisitData);
google.charts.setOnLoadCallback(getBlockData);

var startDate = new Date();
var endDate = new Date();

window.onload = function () {
  this.document.getElementById("date_div").style.display = "none";
  this.document.getElementById("date_div_2").style.display = "none";
};

function getVisitPeriod() {
  var date = Date.now();
  const dateFilter = this.document.getElementById("visitedDateFilter").value;
  const dateDiv = this.document.getElementById("date_div");
  console.log(dateFilter);
  if (dateFilter == "dateWise") {
    dateDiv.style.display = "flex";
  } else if (dateFilter == "thisWeek") {
    startDate = date - 7;
    endDate = date;
    getVisitData(startDate, endDate);
    
  } else if (dateFilter == "thisMonth") {
    startDate = date - 30;
    endDate = date;
    getVisitData(startDate, endDate);
  } else {
    dateDiv.style.display = "none";
    getVisitData(0, 0);
  }
  
}

function getBlockPeriod() {
  var date = Date.now();
  const dateDiv = this.document.getElementById("date_div_2");
  const dateFilter = this.document.getElementById("blockDateFilter").value;
  console.log(dateFilter);
  if (dateFilter == "dateWise") {
    dateDiv.style.display = "flex";
  } else if (dateFilter == "thisWeek") {
    startDate = date - 7;
    endDate = date;
    getBlockData(startDate, endDate);
  } else if (dateFilter == "thisMonth") {
    startDate = date - 30;
    endDate = date;
    getBlockData(startDate, endDate);
  } else {
    dateDiv.style.display = "none";
    getBlockData(0, 0);
  }
 
}

function getVisitDate() {
  var date = Date.now();
  let visitStart = this.document.getElementById("startDate").value;
  let visitEnd = this.document.getElementById("endDate").value;
  let startError = this.document.getElementById("startError");
  let endError = this.document.getElementById("endError");
  var fromDate = new Date(visitStart);
  var toDate = new Date(visitEnd);
  var timeDifference = toDate.getTime() - fromDate.getTime();
  var dayDifference = timeDifference / (1000 * 3600 * 24);
    if (visitStart != "" && visitEnd != ""){
      
     
    if ((visitStart < visitEnd) && (dayDifference < 8)) {
       startDate = visitStart;
        endDate = visitEnd;
        getVisitData(startDate, endDate);
      
    }
    else{
      if(visitStart > visitEnd){
      startError.innerHTML = "Starting date cannot be greater than Ending Date";}
      if(dayDifference > 7){
        endError.innerHtml = "Select dates within a range of 7 days";
      }
    }
  }
  else{
    if(visitStart == "")
    {startError.innerHTML = "Date cannot be empty";}
    if(visitEnd == "")
    {endError.innerHTML = "Date Cannot be empty";}
  }
  
}

function getBlockDate() {
  var date = Date.now();
  let blockStart = this.document.getElementById("startBlockDate").value;
  let blockEnd = this.document.getElementById("endBlockDate").value;
  let startError = this.document.getElementById("startBlockError");
  let endError = this.document.getElementById("endBlockError");
  var fromDate = new Date(blockStart);
  var toDate = new Date(blockEnd);
  var timeDifference = toDate.getTime() - fromDate.getTime();
  var dayDifference = timeDifference / (1000 * 3600 * 24);
  if ( blockStart != "" && blockEnd != "" ) {
      
    if ((blockStart < blockEnd) && (dayDifference < 8)) {
      
        startDate = blockStart;
        endDate = blockEnd;
        getBlockData(startDate, endDate);
      }
      else{
        if(blockStart > blockEnd){
        startError.innerHTML = "Starting date cannot be greater than Ending Date";}
        if(dayDifference > 7){
          endError.innerHtml = "Select dates within a range of 7 days";
        }
      }
  }
  else{
    if(blockStart == "")
    {startError.innerHTML = "Date cannot be empty";}
    if(blockEnd == "")
    {endError.innerHTML = "Date Cannot be empty";}
  }
 
}

function getVisitData(dateFrom, dateTo){
  var report;
  var reportdata;
  var data_array = [];
  var newdata;
  var jsonData = fetch("reportdata.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      report = data;
      if(dateFrom && dateTo){
        reportdata = report.filter(function (response) {
          return (response.req_date > dateFrom && response.req_date < dateTo);
        });
      }
      else{
        reportdata = report;
      }
      var dataMap = transformToMap(reportdata);
      console.log("data", dataMap);
      
      
     data_array = [...dataMap.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );  
      
      visitChart(dateFrom, dateTo, data_array);
    });
    
    
}

function visitChart(dateFrom, dateTo, dataArray) {

  var report;
  var reportData;
  var top_visited_hours;
  var top_visited_array = [];
  var array_hours = [];
  var jsonData = fetch("reportdata.json").then(function (resp){
    return resp.json();
  }).then(function (data){
    report = data;
    if(dateFrom && dateTo){
      reportData = report.filter(function (response){
        return (response.req_date > dateFrom && response.req_date < dateTo);
      })
    }
    else{
      reportData = report;
    }
    top_visited_hours = hoursVisited(reportData);
    top_visited_array = [...top_visited_hours.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );
 
  
  var topFivedata = dataArray.slice(0,5);
  
  

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

function getBlockData(dateFrom, dateTo){

 var blocked_array = [];
 var report;
 var reportdata;

  var jsonData = fetch("reportdata.json")
    .then(function (resp) {
      return resp.json();
    }).then(function (data) {
      report = data;
      if(dateFrom && dateTo){
        reportdata = report.filter(function (response) {
          return (response.req_date > dateFrom && response.req_date < dateTo);
        });
      }
      else{
        reportdata = report;
      }

      var blockedMap= blockedSiteMap(reportdata);

      blocked_array = [...blockedMap.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
      );
      blockedChart(dateFrom , dateTo, blocked_array);
    });
    
}

function blockedChart(dateFrom, dateTo, blockedArray){
  var report;
  var reportData;
  var top_visited_hours;
  var top_visited_array = [];
  var array_block_hours = [];
  var jsonData = fetch("reportdata.json").then(function (resp){
    return resp.json();
  }).then(function (data){
    report = data;
    if(dateFrom && dateTo){
      reportData = report.filter(function (response){
        return (response.req_date > dateFrom && response.req_date < dateTo);
      })
    }
    else{
      reportData = report;
    }
    top_visited_hours = hoursVisited(reportData);
    top_visited_array = [...top_visited_hours.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1
        );
  
      var topblockedsite = blockedArray.slice(0, 5);
      
      
      

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

function blockedSiteMap(data) {
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

function hoursVisited(data) {
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
