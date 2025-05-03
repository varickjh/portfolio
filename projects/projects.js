import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// Lab 5
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    ).sort((a, b) => d3.descending(a[0], b[0]));;;
    
    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    let total = 0;

    for (let d of data) {
    total += d;
    }

    let angle = 0;

    for (let d of data) {
    let endAngle = angle + (d / total) * 2 * Math.PI;
    arcData.push({ startAngle: angle, endAngle });
    angle = endAngle;
    }
    let selectedIndex = -1; // Initialize selectedIndex to -1
    let legend = d3.select('.legend');
    let svg = d3.select('svg');
    arcs.forEach((arc, idx) => {
        svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
    
            svg
              .selectAll('path')
              .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : '' // Apply "selected" class to the clicked slice
              ));
            
            // Filter projects based on the selected year
            if (selectedIndex === -1) {
                // If no slice is selected, render all projects
                renderProjects(projectsGiven, projectsContainer, 'h2');
            } else {
                // Get the selected year from the data
                const selectedYear = data[selectedIndex].label;
                // Filter projects by the selected year
                // change made here, doesn't work if we call projects.filter instead of projectsGiven.filter
                const filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
                // Render the filtered projects
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }

            legend
              .selectAll('li')
              .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : 'list-item' // Apply "selected" class to the clicked legend item
            ));
              
        });
    })

    data.forEach((d, idx) => {
    legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .attr('class', 'list-item')
        .html(`<span class="swatch"> </span> ${d.label} <em style="color: grey;">(${d.value})</em>`); // set the inner html of <li>
    })
}
  
// Call this function on page load

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
    // update query value
    query = event.target.value;
    // filter projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    let newLegends = d3.select('.legend');
    newLegends.selectAll('li').remove();
    renderPieChart(filteredProjects);
});
