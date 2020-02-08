var maincolor = 'rgb(251,174,53)';

/* gráfico: estados em 2019 */
$("<div id='totalestados2019' style='min-height:500px;'></div>").insertAfter('h2#resultados');
$.getJSON('./assets/js/data/bolsa_familia_data_per_estado_2019.json', function( data ) {
    let states = [];
    let totals = [];

    $.map( data, function( e ) {
        states.push(e.uf);
        totals.push(parseFloat(e.total)/1000000000);
    });

    let data2019 = [{ 
        x: states,
        y: totals,
        type: 'bar',
        hovertemplate: 'R$ %{y:.2f} bilhões<extra></extra>',
        showlegend: false,
        marker: { color: maincolor}
     }];

    let layout2019 = {
        title: "Repasses para cada estado durante 2019",
        hovermode: 'closest',
        font: {size: 12},
        xaxis: { title: 'Estados',
                 fixedrange: true },
        yaxis: { title: 'Valor dos pagamentos',
                 fixedrange: true,
                 showtickprefix: 'all',
                 tickprefix: 'R$ ',
                 showticksuffix: 'all',
                 ticksuffix: ' bi', }
      };
      
    let config = {responsive: true,
    displayModeBar: false};

    Plotly.newPlot('totalestados2019', data2019, layout2019, config);
});
/***********************************************/

/* gráfico: regiões em 2019 */
$("<div id='chartpies' style='display:flex;max-height:400px;'><div id='regioes2019' style='width:50%;height:100%;'></div><div id='regioes2019_proporc' style='width:50%;height:100%;'></div></div>").insertAfter('div#totalestados2019');
/*

*/
var colorspie = [
    'rgb(186, 255, 71)',
    'rgb(0, 53, 166)', 
    'rgb(2, 136, 203)', 
    'rgb(4, 223, 241)', 
    'rgb(74, 255, 184)',
];
let regioes2019 = [{ 
    values: [4.444994978,
             16.179490227,
             7.573443283,
             1.674861409,
             1.286445799],
    labels: ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'],
    type: 'pie',
    marker:{
        colors: colorspie,
    },
    hovertemplate: 'Total de<br>R$ %{v:.2f} bi<extra></extra>',
    textinfo: "label+percent",
    textposition: "outside",
    automargin: true
}];

let regioes2019_proporc = [{ 
    values: [241.16975,
             283.49432,
              85.70012,
              55.87344,
              78.93722],
    labels: ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'],
    type: 'pie',
    marker:{
        colors: colorspie,
    },
    hovertemplate: 'Média de R$ %{v:.2f}<br>por habitante do %{label}<extra></extra>',
    textinfo: "label+percent",
    textposition: "outside",
    automargin: true,
}];

let layout_regioes_2019 = {
    title: "Pagamentos para cada região<br>durante 2019 em valores exatos",
    hovermode: 'closest',
    font: {size: 11},
    showlegend: false,
};

let layout_regioes_2019_proporc = {
    title: "Pagamentos para cada região<br>durante 2019 em valores<br>proporcionais à população",
    hovermode: 'closest',
    font: {size: 11},
    showlegend: false,
};
    
let config = {responsive: true,
displayModeBar: false,
};

Plotly.newPlot('regioes2019', regioes2019, layout_regioes_2019, config);
Plotly.newPlot('regioes2019_proporc', regioes2019_proporc, layout_regioes_2019_proporc, config);
/***********************************************/

/* gráfico: repasses durante os anos */
$("<div id='totalanos' style='min-height:500px;'></div>").insertAfter('div#chartpies');
$.getJSON('./assets/js/data/bolsa_familia_data_per_year.json', function( data ) {
    let years = [];
    let totals = [];

    $.map( data, function( e ) {
        years.push(parseInt(e.year));
        totals.push(parseFloat(e.total)/1000000000);
    });

    let data_anos = [{ 
        x: years,
        y: totals,
        type: 'scatter',
        mode: 'lines+markers+text',
        text: [
            'R$ 24,89 bi', // 2013
            'R$ 27,19 bi', // 2014
            'R$ 27,65 bi', // 2015
            'R$ 28,50 bi', // 2016
            'R$ 29,04 bi', // 2017
            'R$ 30,62 bi', // 2018
            'R$ 31,15 bi', // 2019
            ],
        textposition: 'top',        
        //hovertemplate: 'R$ %{y:.2f} bilhões<extra></extra>',
        showlegend: false,
        hoverinfo:'skip',
        marker: { color: maincolor}
     }];

    let layout_anos = {
        title: "Repasses ao longo dos anos",
        hovermode: 'closest',
        font: {size: 12},
        xaxis: { title: 'Anos',
                 fixedrange: true },
        yaxis: { title: 'Valor dos pagamentos',
                 showtickprefix: 'all',
                 tickprefix: 'R$ ',
                 showticksuffix: 'all',
                 ticksuffix: ' bi',
                 fixedrange: true }
      };
      
    let config = {responsive: true,
    displayModeBar: false};

    Plotly.newPlot('totalanos', data_anos, layout_anos, config);
});
/***********************************************/
