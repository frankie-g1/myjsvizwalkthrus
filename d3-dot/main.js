import { select, selectAll } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import Popup from '@flourish/popup'
import uniq from 'lodash-es/uniq'

function drawXAxis(data){

    let years = uniq(data.map(d => d['yearSubmitted']))
        .filter(d => d != '')
        .sort()
    

    let scale = scaleLinear()
        .domain(extent(years))
        .range(0, 100)


    let xaxis = axisBottom(scale)

    select('.x-axis')
        .call(xaxis)
}



function draw(data){

    drawXAxis()
}


fetch('./repd.json')
    .then(res => res.json())
    .then(data => draw(data))