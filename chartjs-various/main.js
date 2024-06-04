import './style.css'
import Chart from 'chart.js/auto';
import { tidy, filter, count, sort, desc, groupBy, summarize, n } from '@tidyjs/tidy';
import uniq from 'lodash-es/uniq'

Chart.defaults.plugins.legend.display = false;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.scale.title.font = {size: 14};
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.plugins.title.display = true;

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

    
    console.log(chartData)


    const chart3 = new Chart("chart3", {
        type : 'line',
        
        data:chartData,
        
        options:{
            plugins: {
                title: {
                    display: true,
                    text: ''
                },
                legend: {
                    display:true
                }
            }
                
        }
    });
}


function draw(data){
    drawChart1(data);
    drawChart2(data);
    drawChart3(data);
}

fetch('./repd.json')
    .then(res => res.json())
    .then(data => draw(data))