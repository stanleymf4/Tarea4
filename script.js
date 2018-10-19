
function refreshData(p_anno) {
    $( "#chart" ).empty();
    let rawDS = d3.csv("https://raw.githubusercontent.com/stanleymf4/Tarea4/master/hurto_comercio.csv", 
        type, function(data) {
                    return {
                        anno:       +data["anno"],
                        date:       new Date(data["date"]),
                        arma_blanca:   +parseFloat(data["arma_blanca"]),
                        arma_fuego:  +parseFloat(data["arma_fuego"]),
                        contundente:      +parseFloat(data["contundente"]),
						sin_armas:       +parseFloat(data["sin_armas"])
                    };
            });

    (async function read() {

        let data = await rawDS;
        
        console.table("data");
       // console.log(data);
        console.table(data);

       let columnsT = data["columns"];

       /* console.table("columnsT");
        console.log(columnsT);
    */

        let svg = d3.select("svg"),
            margin = { top: 20, right: 80, bottom: 40, left: 50 },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%x"),
            bisectDate = d3.bisector(function(d) { return d.date; }).left,
            toolTime = d3.timeFormat("%B %d, " + "20" + "%y"),
            abbreviateNum = d3.format('');

        var xAxisTime = d3.timeFormat("%b");

        var x0AxisYear = d3.timeFormat("20" + "%y")

        var viridisColors = ["#440154", "#440256", "#450457", "#450559", "#46075a", "#46085c", "#460a5d", "#460b5e", "#470d60", "#470e61", "#471063", "#471164", "#471365", "#481467", "#481668", "#481769", "#48186a", "#481a6c", "#481b6d", "#481c6e", "#481d6f", "#481f70", "#482071", "#482173", "#482374", "#482475", "#482576", "#482677", "#482878", "#482979", "#472a7a", "#472c7a", "#472d7b", "#472e7c", "#472f7d", "#46307e", "#46327e", "#46337f", "#463480", "#453581", "#453781", "#453882", "#443983", "#443a83", "#443b84", "#433d84", "#433e85", "#423f85", "#424086", "#424186", "#414287", "#414487", "#404588", "#404688", "#3f4788", "#3f4889", "#3e4989", "#3e4a89", "#3e4c8a", "#3d4d8a", "#3d4e8a", "#3c4f8a", "#3c508b", "#3b518b", "#3b528b", "#3a538b", "#3a548c", "#39558c", "#39568c", "#38588c", "#38598c", "#375a8c", "#375b8d", "#365c8d", "#365d8d", "#355e8d", "#355f8d", "#34608d", "#34618d", "#33628d", "#33638d", "#32648e", "#32658e", "#31668e", "#31678e", "#31688e", "#30698e", "#306a8e", "#2f6b8e", "#2f6c8e", "#2e6d8e", "#2e6e8e", "#2e6f8e", "#2d708e", "#2d718e", "#2c718e", "#2c728e", "#2c738e", "#2b748e", "#2b758e", "#2a768e", "#2a778e", "#2a788e", "#29798e", "#297a8e", "#297b8e", "#287c8e", "#287d8e", "#277e8e", "#277f8e", "#27808e", "#26818e", "#26828e", "#26828e", "#25838e", "#25848e", "#25858e", "#24868e", "#24878e", "#23888e", "#23898e", "#238a8d", "#228b8d", "#228c8d", "#228d8d", "#218e8d", "#218f8d", "#21908d", "#21918c", "#20928c", "#20928c", "#20938c", "#1f948c", "#1f958b", "#1f968b", "#1f978b", "#1f988b", "#1f998a", "#1f9a8a", "#1e9b8a", "#1e9c89", "#1e9d89", "#1f9e89", "#1f9f88", "#1fa088", "#1fa188", "#1fa187", "#1fa287", "#20a386", "#20a486", "#21a585", "#21a685", "#22a785", "#22a884", "#23a983", "#24aa83", "#25ab82", "#25ac82", "#26ad81", "#27ad81", "#28ae80", "#29af7f", "#2ab07f", "#2cb17e", "#2db27d", "#2eb37c", "#2fb47c", "#31b57b", "#32b67a", "#34b679", "#35b779", "#37b878", "#38b977", "#3aba76", "#3bbb75", "#3dbc74", "#3fbc73", "#40bd72", "#42be71", "#44bf70", "#46c06f", "#48c16e", "#4ac16d", "#4cc26c", "#4ec36b", "#50c46a", "#52c569", "#54c568", "#56c667", "#58c765", "#5ac864", "#5cc863", "#5ec962", "#60ca60", "#63cb5f", "#65cb5e", "#67cc5c", "#69cd5b", "#6ccd5a", "#6ece58", "#70cf57", "#73d056", "#75d054", "#77d153", "#7ad151", "#7cd250", "#7fd34e", "#81d34d", "#84d44b", "#86d549", "#89d548", "#8bd646", "#8ed645", "#90d743", "#93d741", "#95d840", "#98d83e", "#9bd93c", "#9dd93b", "#a0da39", "#a2da37", "#a5db36", "#a8db34", "#aadc32", "#addc30", "#b0dd2f", "#b2dd2d", "#b5de2b", "#b8de29", "#bade28", "#bddf26", "#c0df25", "#c2df23", "#c5e021", "#c8e020", "#cae11f", "#cde11d", "#d0e11c", "#d2e21b", "#d5e21a", "#d8e219", "#dae319", "#dde318", "#dfe318", "#e2e418", "#e5e419", "#e7e419", "#eae51a", "#ece51b", "#efe51c", "#f1e51d", "#f4e61e", "#f6e620", "#f8e621", "#fbe723", "#fde725"]


        var viridisThreeColors = [viridisColors[200], viridisColors[25], viridisColors[110],viridisColors[250]]

        var x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(viridisThreeColors);

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.valor); });

       //var consulta = Object.assign({}, data.filter(function (d) { return d.anno == "2017" }));

        /*var keys = data.columns.slice(0,1);
        console.log("keys");
        console.log(keys);*/
       
        var consultaGroup = d3.nest()
                              .key(function(d) { return d.anno; })
                              .entries(data);

        /*console.log("consultaGroup");
        console.log(consultaGroup);*/
        var dataFiltered = consultaGroup.filter(function (d) { return d.key === p_anno })
        var dataFiltered2 = dataFiltered.map(d=> d.values);
        var consultaSort=dataFiltered2[0];

        
        consultaSort["columns"] = columnsT;

        console.log("consultaSort");
        console.log(consultaSort);

        let bands3 = data.columns.slice(2).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return { date: d.date, valor: d[id] };
                })
            };
        });

       /* console.table("bands");
        console.log(bands);*/
       // console.table(bands);

        let bands = consultaSort.columns.slice(2).map(function(id) {
            return {
                id: id,
                values: consultaSort.map(function(d) {
                    return { date: d.date, valor: d[id] };
                })
            };
        });

        console.table("band2s");
        console.log(bands);
        console.table(bands);


        x.domain(d3.extent(consultaSort, function(d) { return d.date; }));

        y.domain([
            d3.min(bands, function(c) { return d3.min(c.values, function(d) { return d.valor; }); }),
            d3.max(bands, function(c) { return d3.max(c.values, function(d) { return d.valor + 30; }); })
        ]);

        z.domain(bands.map(function(c) { return c.id; }));
         // imprime meses eje X
        g.append("g")
            .attr("class", "axis axis--x months")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(xAxisTime).tickSizeOuter(0).tickPadding(10) //ticks was removed here, check ticks for d3 v5
            );
         // imprime años eje X
        g.append('g')
            .attr('class', 'axis axis--x years')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(x0AxisYear).tickSizeOuter(0).tickPadding(25) //ticks was removed here, check ticks for d3 v5
            );

         // imprime valor  eje y
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y) //ticks was removed here, check ticks for d3 v5
                .tickSizeOuter(0).tickPadding(0));


         // imprime leyenda   eje y 
        g.append('g')
            .attr('class', 'legend')
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -82)
            .attr("y", -45)
            .attr("dy", "0.71em")
            .attr('font-size', '12px')
            .attr("fill", "#3d3d3d")
            .text("Número de hurtos");

        var band = g.selectAll(".band")
            .data(bands)
            .enter().append("g")
            .attr("class", "band");

        // imprime las lineas 
        band.append("path")
            .attr("class", "line")
            .attr("d", function(d) {
                //console.log(d.values[1]);
                return line(d.values);
            })
            .style("stroke", function(d) { return z(d.id); });

        // imprime texto final de linea
        /*band.append("text")
            .attr('class', 'bands')
            .datum(function(d) { return { id: d.id, value: d.values[d.values.length - 1] }; })
            .attr("transform", function(d) { return "translate(" + (x(d.value.date) - 10) + "," + (y(d.value.valor) - 8) + ")"; })
            .attr("x", -20)
            .attr('text-align', 'right')
            .attr("dy", "0.45em")
            .style('stroke', '#252525')
           // .style("font", "10px sans-serif")
            .text(function(d) { return d.id; });*/

        //set your focus circle and make sure it's invisible
        var focus = band.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // imprime linea vertical de desplazamiento
        focus.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height)
            .style('stroke-width', 3)
            .style('stroke-dasharray', '1,6')
            .style('stroke', '#dd1c77');

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".45em");



        //Crear un área de enfoque para el evento del ratón
        band.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);



        //Función de movimiento del ratón para vigilar el enfoque.
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                y0 = y(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0,
                thisBand = "";
            focus.transition()
                .duration(50)
                .attr('transform', 'translate(' + x(x0) + ', 0)');


            // imprimer caja com tooltip 
            d3.select("#tooltip")
                .select('#date')
                .text("Para la fecha  " + toolTime(d.date));


             d3.select("#tooltip")
               .select("#value")
               .html('<span id="box" class="legendTitle">Arma Blanca</span><div id="boxSpacer">' + abbreviateNum(d.arma_blanca) + '</div>    '
                   + '<span id="box" class="legendRGB">Arma de Fuego</span><div id="boxSpacer">' + abbreviateNum(d.arma_fuego) + '</div>    '
                   + '<span id="box" class="legendRG">Contundentes</span><div id="boxSpacer">' + abbreviateNum(d.contundente) + '</div>    '
				   + '<span id="box" class="legendNIR">Sin armas</span>' + abbreviateNum(d.sin_armas) );
        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);
      }

        //Annotations
        var annotations = g.append('g').attr('class', 'annotations');
    })();
}

function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}