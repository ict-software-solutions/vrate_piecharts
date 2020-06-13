google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);


function drawTable(){
    var table_array = [];
    var jsonData = fetch("reportdata.json").then(function(resp){
        return resp.json();
      })
      .then(function (value) {
        reportdata = value;
        var dataMapReqd = transformToMap(reportdata);
        var data_array = [...dataMapReqd.entries()].sort((a, b) =>
          Number(a[1]) < Number(b[1]) ? 0 : -1
        );


        var top_visited_hours = hoursvisited(reportdata);
        var top_visited_array = [...top_visited_hours.entries()].sort((a,b)=> Number(a[1]) < Number(b[1])?0:-1);

        var blockedmapreqd = blockedsitemap(reportdata);
        var blocked_array = [...blockedmapreqd.entries()].sort((a, b) =>
        Number(a[1]) < Number(b[1]) ? 0 : -1);


        for(let i=0; i< data_array.length; i++){
            for(let j=0; j<top_visited_array.length; j++){
                if(data_array[i][0] == top_visited_array [j][0]){
                    for(let k=0; k<blocked_array.length; k++)
                    {
                        if(data_array[i][0] == blocked_array[k][0]){
                            table_array.push([data_array[i][0],data_array[i][1],top_visited_array[j][1],blocked_array[k][1]]);
                        }
                    }
                }
            }
        }
        console.log('table',table_array);
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Domain');
        data.addColumn('number', 'Visits');
        data.addColumn('number', 'Hours Spent');
        data.addColumn('number', 'Blocked rate');
        data.addRows(table_array);
          var table = new google.visualization.Table(document.getElementById('viewtable'));
          var options = {
            page: 'enable',
            pageSize: 15,
            pagingSymbols: {
              prev: 'prev',
              next: 'next'
          },
          showRowNumber: true

          }
 
          table.draw(data, options);
      })

}

function blockedsitemap(data){
    var returnMap = new Map();

    data.forEach((element)=>{
       if(!returnMap.get(element.domain)){
           returnMap.set(element.domain,element.all_dom_checks);
       }
       else{
           returnMap.set(element.domain, Number(returnMap.get(element.domain)+element.all_dom_checks))
       }
    })

    return returnMap;
}

function transformToMap(data) {
    
    var returnMap =  new Map();
    
    data.forEach((element) => {
    if(!returnMap.get(element.domain)){
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
      returnMap.set(element.domain, (Math.ceil(element.v_span_hr + (element.v_span_min/60))));
    } else {
      returnMap.set(
        element.domain,
        Number(returnMap.get(element.domain) + (Math.ceil(element.v_span_hr + (element.v_span_min/60))))
      );
    }
  });

  return returnMap;
}
