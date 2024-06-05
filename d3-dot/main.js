import { select, selectAll } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"
import { scaleLinear, scaleTime } from "d3-scale"
import { extent } from "d3-array"
import { mutate, filter } from '@tidyjs/tidy'
import Popup from '@flourish/popup'

function drawXAxis(data){

    let width = 1200, height = 600;
    let leftMargin = 210, rightMargin = 20, topMargin = 20, bottomMargin = 40;
    
    let yearsExtent = extent(data, d=> d.dateSubmitted)
    let xLength = width - leftMargin - rightMargin;
    
    let scale = scaleTime()
        .domain(yearsExtent)
        .range([0, xLength])

    let xaxis = axisBottom(scale)


    select('svg .x-axis')
        .attr('transform', 'translate(' + leftMargin + ',' + topMargin +')')
        .call(xaxis);


    se
}



function draw(data){

    drawXAxis(data)
}


function initData(data){
    
    // Tidy is great because it filters, mutates, and sorts
    // functions are done 'in place' memory
    let data = tidy(
        data,
        filter(d => d.dateSubmitted != ''),
        mutate({
            dateSubmitted : d => new Date(d.dateSubmitted)
        }),
        sort(desc('capacity'))
    )
}


fetch('./repd.json')
    .then(res => res.json())
    .then(data => initData(data))