import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleTime, scalePoint, scaleSqrt } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import Popup from '@flourish/popup';


let popup = Popup()

let data =    
[
    { age: 20, height: 189},
    { age: 44, height: 160},
    { age: 23, height: 200},

]

let data2 =    
[
    { x: 20, size: 10},
    { x: 200, size: 20},
    { x: 110, size: 55},

]


select('svg')
    .selectAll('circle')
    .data(data2)
    .join('circle')
    .style('fill', 'orange')
    .style('state', '#aaa')
    .attr('cx', d => d.x)
    .attr('cy', 200)
    .attr('r', d => d.size)
    .on('mouseover', (e, d) => {
        popup
            .point(e.target)
            .html('The radius is ' + d.size)
            .draw()
    })
    .on('mouseout', () => {
        popup.hide()
    })





let myScale = scaleLinear()
    .domain([0, 100])
    .range([0, 500])


console.log(myScale(5))



let pointScale = scalePoint()
    .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    .range([0, 500])

//console.log(pointScale('x')); // undefined
console.log(pointScale('Mon'))



let sqrtScale = scaleSqrt()
    .domain([0, 100])
    .range([0, 500])

sqrtScale(0);
sqrtScale(2);
sqrtScale(20);


let scale = scaleLinear()
    .domain([-100, 100])
    .range([0, 500])

let axis = axisBottom(scale)

select('.x-axis')
    .call(axis)

