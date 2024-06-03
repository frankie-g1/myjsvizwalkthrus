import './style.css'



function drawCharts(data){
    
}

fetch('./repd.json')
    .then(res => res.json())
    .then(data => drawCharts(data))