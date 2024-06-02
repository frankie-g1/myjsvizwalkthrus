import Chart from 'chart.js/auto'


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