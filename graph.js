//Data url
var data_url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
//extraer data
async function fetchData(id) {
  try {
    const response = await fetch(id, {
      method: "GET",
      credentials: "same-origin",
    });
    const test = await response.json();
    return test;
  } catch (error) {
    console.error(error);
  }
}
//funcion general
async function renderGraph(id) {
  //objeto que conteniene la data del json
  const response = await fetchData(id);
  //Array de años en formato Date
  var ArrayYears = response.map(function (item) {
    let year = new Date();
    year.setFullYear(item.Year);
    return year;
  });
  //Array de tiempos en formato Date
  var ArrayTime = response.map(function (item) {
    let time = new Date();
    time.setHours(0);
    time.setMinutes(...item.Time.split(":"));
    return time;
  });
  //console.log(ArrayYears);
  var chartWidth = 1250;
  var chartHeight = 600;

  var svgContainer = d3
    .select("#graph")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  var tooltip = d3
    .select(".visHolder")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  var legend = d3.select(".visLegend").append("div").attr("id", "legend");

  legend.html("No doping allegations <br><br> Riders with Doping Allegations");

  svgContainer
    .append("circle")
    .attr("cx", 5)
    .attr("cy", 112)
    .attr("r", 5)
    .style("fill", "#456268");

  svgContainer
    .append("circle")
    .attr("cx", 5)
    .attr("cy", 155)
    .attr("r", 5)
    .style("fill", "orange");

  xMin = d3.min(ArrayYears);
  xMax = d3.max(ArrayYears);
  console.log(xMin);
  console.log(xMax);
  ///
  yMin = d3.min(ArrayTime);
  yMax = d3.max(ArrayTime);
  console.log(yMin);
  console.log(yMax);
  //escalas
  var xScale = d3
    .scaleLinear()
    .domain([xMin.getFullYear() - 1, xMax.getFullYear() + 1])
    .range([0, chartWidth - 350]);

  var yScale = d3
    .scaleTime()
    .domain([yMax, yMin])
    .range([chartHeight - 50, 50]);

  //declaro axis y formateo
  var timeFormat = d3.timeFormat("%M:%S");
  var x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  var y_axis = d3.axisLeft().scale(yScale).tickFormat(timeFormat);

  //adjunto el elemento g por medio del x_axis
  svgContainer
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(100, 550)")
    .call(x_axis);
  //adjunto el elemento g por medio del y_axis
  svgContainer
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(100,0)")
    .call(y_axis);

  //genero puntos a partir de la data
  svgContainer
    .selectAll("circle")
    .data(response)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) {
      return xScale(d.Year) + 100;
    })
    .attr("cy", function (d) {
      let time = new Date();
      time.setHours(0);
      time.setMinutes(...d.Time.split(":"));
      return yScale(time);
    })
    .attr("r", 5)
    .attr("fill", function (d) {
      return d.Doping == "" ? "#456268" : "orange";
    })
    .attr("data-xvalue", function (d) {
      return parseInt(d.Year, 10);
    })
    .attr("data-yvalue", function (d) {
      let yvalue = new Date();
      yvalue.setHours(0);
      yvalue.setMinutes(...d.Time.split(":"));
      return yvalue;
      //  return d.Time;
    })
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .duration(100)
        .attr("data-year", i.Year)
        .style("opacity", 0.9)
        .style("left", d.screenX + 20 + "px")
        .style("top", d.screenY - 100 + "px");
      console.log(i);
      if (i.Doping == "") {
        tooltip.style("width", 150 + "px").style("height", 40 + "px");
      } else {
        tooltip.style("width", 300 + "px").style("height", 60 + "px");
      }
      tooltip.html(
        " " +
          i.Name +
          ": " +
          i.Nationality +
          "<br> Year: " +
          i.Year +
          ", Time: " +
          i.Time +
          "<br>" +
          i.Doping
      );
    })
    .on("mouseout", (d, i) => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  svgContainer.append("tool");
}

renderGraph(data_url);
