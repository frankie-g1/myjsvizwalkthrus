import { select, selectAll } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"
import { scaleLinear, scaleTime, scalePoint, scaleSqrt } from "d3-scale"
import { extent, max } from "d3-array"
import { tidy, mutate, filter, sort, desc } from '@tidyjs/tidy'
import Popup from '@flourish/popup'
import uniq from 'lodash-es/uniq'
import './style.css'

let width = 1200, height = 600;
let leftMargin = 120, rightMargin = 20, bottomMargin = 20, topMargin = 20;


function drawSVGBox(data) {

    select('svg')
        .attr('height', height)
        .attr('width', width)

    select('svg .inner')
        .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')')
    
}


function drawXAxis(data) {

    let minMax = extent(data, d => d.lat)
    let xMax = width - leftMargin - rightMargin;
    let yPos = ((height - bottomMargin - topMargin) / 2 - 100);

    let xScale = scaleLinear()
        .domain(minMax)
        .range([0, xMax])

    let xAxis = axisBottom(xScale)
        .tickSize(yPos)


    select('.x-axis')
        .call(xAxis)

    return xScale

}

function drawYAxis(data, xMax) {

    let minMax = extent(data, d => d.lon)
    let yMax = height - bottomMargin - topMargin;
    let xMaxdiv2 = (width - leftMargin - rightMargin) / 2;

    let yScale = scaleLinear()
        .domain(minMax)
        .range([0, yMax])

    let yAxis = axisLeft(yScale)

    select('.y-axis')
        .attr('transform', 'translate(' + xMaxdiv2 + ',' + 0 + ')')
        .call(yAxis)

    return yScale

}

function drawData(data, xScale, yScale) {

    select('svg')
        .selectAll('coords')
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.lat))
        .attr('cy', d => yScale(d.lon))
        .attr('r', 2)
        .style('fill', '#aaa')

}


function draw(data) {
    drawSVGBox(data)
    let xScale = drawXAxis(data)
    let yScale = drawYAxis(data)
    drawData(data, xScale, yScale)
}



fetch('./repd.json')
    .then(res => res.json())
    .then(data => draw(data))