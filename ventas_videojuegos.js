
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     Variables del gráfico                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////

// Dimensiones
var width = 960,
  height = 400,
  radius = Math.min(width, height) / 2;

// Márgenes del gráfico
 var margin_x = 0;
 var margin_y = 50;

// Elemento SGV que soporta el gráfico
var svg = d3.select("body").append("svg")
  .attr("id", "grafico")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Sectores, líneas y labels
svg.append("g")
  .attr("class", "slices");
svg.append("g")
  .attr("class", "labels");
svg.append("g")
  .attr("class", "lines");

// Título
    var title = d3.select("body")
        .append("div")
        .attr("class", "title")
        .style("left",(-150 + margin_x + width/2 )+ "px")
        .style("top", (margin_y - 25) + "px");


    title.append("text")
        .text("Ventas de videojuegos entre 1980 y 2020");

// Colores
    var color = d3.scale.ordinal()
    .domain(["European_Union","Japan","North_America","Other"])
    .range(["#ffa7bb", "#ffe400", "#7d1399", "#a5bdff"])


// Arcos exteriores e interiores del gráfico
var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

// Género de videojuegos inicial
var genre = "adventure";



////////////////////////////////////////////////////////////////////////////////////////////////////
//                            Construcción e inicialización de objetos                            //
////////////////////////////////////////////////////////////////////////////////////////////////////

// Encontrar los radio buttons del género
var radios = document.querySelectorAll('input[type=radio][name="genre"]');

// Seleccionar el género a representar
radios.forEach(function (d) {
  if (parseInt(d.id) == genre) {
    d.checked = true;
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     Lectura de los datos                                       //
////////////////////////////////////////////////////////////////////////////////////////////////////

d3.csv("datos.csv", function (error, data) {

  // Creao una variable key con los nombres de las regiones
  var key = function(d){ return d.data.region; };

  // Registro los manejadores de eventos para los radio buttons
  radios.forEach(function (d) {
    d.addEventListener('change', cambiarGenero);
  });

  //Función que recibe el evento de selección de otro género y desencadena la modificación del gráfico
  function cambiarGenero(event) {
    genre = this.value;
    modificar_grafico();
  }

  // Guarda información sobre el género seleccionada y filtra los datos
  var dataset = filtrarDatos();

  // Añadimos los datos iniciales
  var pie = d3.layout.pie()
  .sort(null)
  .value(function (d) { return d.x; });

  // Creamos el gráfico inicial
  modificar_grafico();

  // Función para filtrar los datos. Se almacenan en una variable llamada dataset
  function filtrarDatos() {

    var dataset2;

    //Se selecciona el género y se modifica la columna de x en función de ese género

    if (genre == "action") {
      data.forEach(function (d) {
        d.x = parseInt(d.action);
      });
      dataset2 = data.filter(function(d){return (d.action != "NA")});
    }

    if (genre == "adventure") {
        data.forEach(function (d) {
            d.x = parseInt(d.adventure);
        });
        dataset2 = data.filter(function(d){return (d.adventure != "NA")});
    }

    if (genre == "fighting") {
        data.forEach(function (d) {
            d.x = parseInt(d.fighting);
        });
        dataset2 = data.filter(function(d){return (d.fighting != "NA")});
    }

    if (genre == "misc") {
        data.forEach(function (d) {
            d.x = parseInt(d.misc);
        });
        dataset2 = data.filter(function(d){return (d.misc != "NA")});
    }

    if (genre == "platform") {
        data.forEach(function (d) {
            d.x = parseInt(d.platform);
        });
        dataset2 = data.filter(function(d){return (d.platform != "NA")});
    }

    if (genre == "puzzle") {
        data.forEach(function (d) {
            d.x = parseInt(d.puzzle);
        });
        dataset2 = data.filter(function(d){return (d.puzzle != "NA")});
    }

    if (genre == "racing") {
        data.forEach(function (d) {
            d.x = parseInt(d.racing);
        });
        dataset2 = data.filter(function(d){return (d.racing != "NA")});
    }

    if (genre == "role_playing") {
        data.forEach(function (d) {
            d.x = parseInt(d.role_playing);
        });
        dataset2 = data.filter(function(d){return (d.role_playing != "NA")});
    }

    if (genre == "shooter") {
        data.forEach(function (d) {
            d.x = parseInt(d.shooter);
        });
        dataset2 = data.filter(function(d){return (d.shooter != "NA")});
    }

    if (genre == "simulation") {
        data.forEach(function (d) {
            d.x = parseInt(d.simulation);
        });
        dataset2 = data.filter(function(d){return (d.simulation != "NA")});
    }

    if (genre == "sports") {
        data.forEach(function (d) {
            d.x = parseInt(d.sports);
        });
        dataset2 = data.filter(function(d){return (d.sports != "NA")});
    }

    if (genre == "strategy") {
        data.forEach(function (d) {
            d.x = parseInt(d.strategy);
        });
        dataset2 = data.filter(function(d){return (d.strategy != "NA")});
    }

    // Devolvemos el dataset con los datos filtrados
    return dataset2;

  }

  // Función que modifica el gráfico cuando se ha cambiado de género
  function modificar_grafico (){

    dataset = filtrarDatos();

    // Creación de los sectores con transiciones
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(dataset),key);

    slice.enter()
        .insert("path")
        .style("fill", function(d){return color(d.data.region);})
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
        .remove();

    // Interacción cuando se posiciona el cursor sobre un sector
    slice.on("mouseenter", function (d) {
            d3.select(this)
                .attr("stroke", function (d) {
                return color(d.data.region);})
                .transition()
                .duration(500)
                .attr("d", outerArc)
                .attr("stroke-width", 1);

      })
         .on("mouseleave", function (d) {
             d3.select(this).transition()
                 .duration(500)
                 .attr("d", arc)
                 .attr("stroke", "none");
         })


    // Creación de los labels con transiciones
    var text = svg.select(".labels").selectAll("text")
        .data(pie(dataset), key);

    text.enter()
        .append("text")
        .attr("dy", ".25em");
        text.attr("dy", ".25em")
            .style("fill", function(d){return color(d.data.region);})
            .text(function(d) {

              // Escribimos los nombres de las regiones en los sectores

              if(genre == "action") {
                return d.data.region;}

              if(genre == "adventure") {
                  return d.data.region;}

              if(genre == "fighting") {
                  return d.data.region;}

              if(genre == "misc") {
                  return d.data.region;}

              if(genre == "platform") {
                  return d.data.region;}

              if(genre == "puzzle") {
                  return d.data.region;}

              if(genre == "racing") {
                  return d.data.region;}

              if(genre == "role_playing") {
                  return d.data.region;}

              if(genre == "shooter") {
                  return d.data.region;}

              if(genre == "simulation") {
                  return d.data.region;}

              if(genre == "sports") {
                  return d.data.region;}

              if(genre == "strategy") {
                  return d.data.region;}

            });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });

    text.exit()
        .remove();

    // Creación de las líneas con transiciones
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(dataset), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
    };
});
