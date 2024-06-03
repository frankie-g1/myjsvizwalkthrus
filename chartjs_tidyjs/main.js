import Chart from 'chart.js/auto'
import { tidy, filter, count, groupBy, mutate, rename, sort, desc } from '@tidyjs/tidy'


let chart = new Chart('chart1', {
    type:'bar',
    data: {
        labels: ['A', 'B'],
        datasets:[
            {
                data: ['10','2', ]
            },
            {
                data: ['14','3', ]
            }
        ]
    },
    options:{

        
        // Depends on other options chosen -
        // - overwrites manual set of attribute aspectRatio
        // - will maintain hardcode ratio outside of instantion

        maintainAspectRatio: false,
        
        
        // is overwritten/moot if you are hardcoding the ratio
        // Goes with maintainAspectRatio false.
        //responsive:true, 
        
        
        // Goes with maintainAspectRatio false. width/height. 1 is square
        aspectRatio: 1,
        
        
        scales:{
            x:{
                stacked: true
            }
        },
        plugins:{
            title:{
                display: true,
                text: "My chart's title"
            }
        }
    }
})
// chart.canvas.parentNode.style.height = '1280px';
// chart.canvas.parentNode.style.width = '1280px';

function tidyjs_stuff(data) {

    let region_summary = tidy(
        data,
        count('region'),
        //sort(desc('n'))
        sort('region')
    )

    let list = '';
    region_summary.forEach(d =>{
        list += '<div>' + d.region + ' (' + d.n + ') ' + '</div>'
    })
    console.log(region_summary)
    document.querySelector('#output').innerHTML = list;

    let chart = new Chart('chart2', {
        type:'bar',
        data: {
            // DO NOT REARRANGE DATA HERE. DECONSTRUCTION OF DATA BETWEEN LABELS AND DATA
            // ALLOWS FOR UNRELATED DATA TO MATCH UP I.E. SCOTLAND NOT GOING WITH 1666.
            labels: region_summary.map((d, i) => d.region),
            datasets:[
                {
                    data: region_summary.map((d, i) => d.n)
                }
            ]
        },
        options:{
            
            responsive:true, 
        
            plugins:{
                title:{
                    display: true,
                    text: "Researches by Region"
                },
                legend:{
                    display: false
                }
            }
        }
    })
    
    return chart
}

fetch('./repd.json')
  .then(res => res.json())
  .then(data => tidyjs_stuff(data));

