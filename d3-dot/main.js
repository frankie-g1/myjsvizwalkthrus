import { select, selectAll } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"
import { scaleLinear, scaleTime, scalePoint, scaleSqrt } from "d3-scale"
import { extent, max } from "d3-array"
import { tidy, mutate, filter, sort, desc } from '@tidyjs/tidy'
import Popup from '@flourish/popup'
import uniq from 'lodash-es/uniq'
import './style.css'

let popup = Popup();

let green = "#358600";
let grey = '#aaa';
let purple = '#A675A1';
let yellow = '#F5CF29';

let statusColors = {
    "Abandoned": grey,
    'Appeal Withdrawn' : grey,
    'Application Refused': grey,
    'Application Submitted': purple,
    'Application Withrdrawn' : grey,
    'Awaiting Construction' : yellow,
    'Decommissioned' : grey,
    'No Application Required' : yellow,
    'Operational' : green,
    'Planning Permission Expired': grey,
    'Under Construction': yellow
}

let width = 1200, height = 600;
let leftMargin = 210, rightMargin = 20, topMargin = 20, bottomMargin = 40;
    


function drawSVGBox(){
    
    select('svg') // the graph is cut off by the limits of the container if not for this.
        .attr('width', width)
        .attr('height', height)

    select('svg .inner') // moves stuff to the right so the y labels can show
        .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')');

}


function drawXAxis(data){
    let yearsExtent = extent(data, d=> d.dateSubmitted)
    let xLength = width ;
    let ypos = height - bottomMargin;
    let xScale = scaleTime()
        .domain(yearsExtent)
        .range([0, xLength]);

    let xAxis = axisBottom(xScale)
        .tickSize(ypos)

    select('.x-axis') // notice you don't need access inner
        .call(xAxis)

    return xScale
}

function drawYAxis(data){
    let technologies = uniq(data.map(d => d.technology))
        .filter(d => d.technology != '')
        .sort()
    
    let yLength = height - topMargin - bottomMargin;

    let yScale = scalePoint()
        .domain(technologies)
        .range([0, yLength])
    
    
    let yAxis = axisLeft(yScale)
        .tickSize(0)

    select('svg .y-axis') // notice you don't need access inner
        .call(yAxis)

    return yScale
}

function drawData(data, xScale, yScale) {

    let maxRadius = 20;
    let maxCapacity = max(data, d => d.capacity);
    let radiusScale = scaleSqrt()
        .domain([0, maxCapacity]) // allow input from 0 to maxCapacity
        .range([0, maxRadius]) // transform/convert it to 0 to maxRadius scale

 


    select('svg .points')
        .selectAll('point')
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.dateSubmitted)) // these pass ints, not built indexes for array
        .attr('cy', d => yScale(d.technology))
        .attr('r' , d => radiusScale(d.capacity))    //(radiusScale(data.map(d => d.capacity)))
        .style('fill', d => statusColors[d.status])    //// these two are the 'same' in the sense that we are passing a mapped array to the function.
        .style('stroke', d => statusColors[d.status])    //(radiusScale([100, 200]))
        .style('fill-opacity', 0.5)
        .on('mouseover', (e, d) => {
            let html = '';
            html += '<div>Name: ' + d.name + '</div>';
            html += '<div>Technology: ' + d.technology + '</div>';
            html += '<div>Capacity: ' + d.capacity + '</div>';
            html += '<div>Date submitted: ' + d.dateSubmitted + '</div>';
            html += '<div>Status: ' + d.status + '</div>';

            popup
                .point(e.target)
                .html(html)
                .draw()
        })
        .on('mouseout', () => {
            popup
                .hide()
        })
    }

function draw(data){

    drawSVGBox()
    let xScale = drawXAxis(data)
    let yScale = drawYAxis(data)
    drawData(data, xScale, yScale)

}


function initData(data){
    
    // Tidy is great because it filters, mutates, and sorts
    // functions are done 'in place' memory
    data = tidy(
        data,
        filter(d => d.dateSubmitted != null),
        mutate({
            dateSubmitted : d => new Date(d.dateSubmitted)
        }),
        sort(desc('capacity'))
    )

    draw(data);
}


fetch('./repd.json')
    .then(res => res.json())
    .then(data => initData(data))