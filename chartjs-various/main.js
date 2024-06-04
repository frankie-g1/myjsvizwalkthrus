import './style.css'
import Chart from 'chart.js/auto';
import { tidy, filter, count, sort, desc, groupBy, summarize, n } from '@tidyjs/tidy';
import uniq from 'lodash-es/uniq'

Chart.defaults.plugins.legend.display = false;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.scale.title.font = {size: 14};
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.plugins.title.display = true;

const technologyPalette = {
    'Advanced Conversion Technologies': '#FF9999',
    'Anaerobic Digestion': '#C58882',
    'Battery': '#B6A6CA',
    'Biomass (co-firing)': '#50723C',
    'Biomass (dedicated)': '#50723C',
    'EfW Incineration': '#B56B45',
    'Large Hydro': '#469B77',
    'Small Hydro': '#469B77',
    'Wind Onshore': '#6D98BA',
    'Wind Offshore': '#6D98BA',
    'Solar Photovoltaics': '#EEC170',
    'Landfill Gas': '#AF4319'
  };

function drawChart1(data){
    let summary = tidy(
        data,
        count('technology', {sort:true})
    )

    const chart1 = new Chart("chart1", {
        type : 'bar',
        
        data:{
            labels: summary.map(row => row.technology),
            datasets:[
                {
                    data: summary.map(row => row.n),
                    backgroundColor: '#19A0AA' // color of the bars.
                }
            ],
        },
        
        scales:{
            x:{
                title:{
                    display: false
                }
            },
            y:{
                title:{
                    text: 'Number of applications'
                }
            }
        },
        options:{
            indexAxis: 'y',
            plugins:{
                title:{
                    display: true,
                    text: 'Number of planning applications (by technology) 1990-2022'
                }
            }
        }
    });
}

function drawChart2(data){
    let summary = tidy(
        data,
        count('technology', {sort:true})
    )

    const chart2 = new Chart("chart2", {
        type : 'bar',
        
        data:{
            labels: summary.map(row => row.technology),
            datasets:[
                {
                    data: summary.map(row => row.n),
                    backgroundColor: '#19A0AA' // color of the bars.
                }                
            ],
        },
        
        
        options:{
            indexAxis: 'y',
            scales:{
                x: {
                    title: {
                      display: true,
                      text: 'Number of applications',
                      color: '#eee'
                    },
                    ticks: {
                      color: '#ccc'
                    },
                    grid: {
                      color: '#555'
                    }
                  },
                  y: { // When Y is inverted, Y refers to the X data here.
                    ticks: {
                      color: '#ccc'
                    },
                    grid: {
                      color: '#333'
                    }
                  }
            },
            plugins:{
                title:{
                    display: true,
                    text: 'Number of planning applications (by technology) 1990-2022'
                }
            }
        }
    });
}


function drawChart3(data){
    
    let years = uniq(data.map(d => d['yearSubmitted']))
        .filter(d => d !== '')
        .sort();

    let technologies = uniq(data.map(d => d['technology']))
    .filter(d => d !== '')
    .sort();

    // dataset series is type []
    // push iteratively into it { label: str, data: []}
    let chartData = {
        labels: years,
        datasets: technologies.map(technology => {
            return {
                label: technology,
                data: []
            }
        })
    }

    chartData.datasets.map(index =>{
        years.forEach(year =>{
            index.data.push(tidy(
                data,
                filter(d=> d.technology === index.label && d.yearSubmitted === year),
                count()
            ).length)
        })
    })

    // Legend uses the same styling classes as the lines
    chartData.datasets.forEach(series => {
        let color = technologyPalette[series.label] || '#aaa';
        // series.backgroundColor = color; // changes the whole line's color
        series.borderWidth = 2;
        series.radius = 2; // line graph dots
    });
//
    const chart3 = new Chart("chart3", {
        type : 'line',
        
        data:chartData,
        
        options:{
            plugins: {
                title:{
                    display: true,
                    text: 'Number of applications (by technology) 1990-2022'
                },
                legend:{
                    display:true
                }
            },

            scales:{
                x:{
                    title: {
                        text: 'Year',
                        display: true,
                        font: {
                            size: 12
                        }
                    }                        
                },
                y:{
                    title: {
                        text: 'Number of applications',
                        display: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
                
        }
    });
}

function drawChart4(data) { 

    let regions = uniq(data.map(d => d.region))
        .filter(d => d !== '')
        .sort()

    let technologies = uniq(data.map(d => d.technology))
        .filter(d => d !== '')
        .sort()
    
    let chartData = {
        labels: regions,
        datasets: technologies.map(i => {
            return {
                label: i,
                data: []
            }
        })
    }

    //chartData.datasets.forEach(series => {
    //    regions.forEach(region => {
    //        series.data.push(tidy(
    //            data,
    //            filter(d=> d.technology == series.label && d.region == region),
    //            count()
    //        )).length
    //    })
    //})

    //chartData.datasets.forEach(index =>{
    //    regions.forEach(region => {
    //        index.data.push(data.filter(d=> d.region === region && d.technology === index.label).length)
    //    })
    //})

    chartData.datasets.forEach(index =>{
        index.data = regions.map(region => {
            return data.filter(d=> d.region === region && d.technology === index.label).length
        })
    })

    console.log(chartData)

    let chart4 = new Chart('chart4', {
        type: 'bar',
        data:chartData,

        options:{
            scales:{
                x:{
                    stacked: true
                },
                y:{
                    title:{
                        text:'Number of applications'
                    }
                }
            },
            plugins:{
                title:{
                    text: 'Number if applications (by region and technology) 1990-2022',
                    font:{
                        size: 12
                    },
                    display:true
                },
                legend:{
                    display:true
                }
            },
        }
    })
}


function draw(data){
    drawChart1(data);
    drawChart2(data);
    drawChart3(data);
    drawChart4(data);
}

fetch('./repd.json')
    .then(res => res.json())
    .then(data => draw(data))