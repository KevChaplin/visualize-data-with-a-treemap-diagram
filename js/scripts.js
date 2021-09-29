const dataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
let movieData

const w = 1500
const h = 800

// Each color indicates movie genre
const colors = ["#c18c40", "#b65cbf", "#7ca343", "#747fca", "#ca5941", "#49ae8a", "#c8577d"]

// Main svg element
const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)

// Function to draw treemap diagram, called once data fetch complete
const drawTreeMap = () => {
  const hierarchy = d3.hierarchy(movieData, (node) => {
    return node.children
  }).sum(node => {
    return node.value
  }).sort((node1, node2) => {
    return node2.value - node1.value
  })

  const createTreeMap = d3.treemap()
                          .size([w, h-100])

  createTreeMap(hierarchy)

  const movieTiles = hierarchy.leaves()

  // Movie tiles, g element so that we can append rect and text elements.
  const block = svg.selectAll("g")
                    .data(movieTiles)
                    .enter()
                    .append("g")
                    .attr("transform", movie => {
                      return  `translate(${movie.x0}, ${movie.y0})`
                    })

  var tooltip = d3.select("#tooltip")

  block.append("rect")
        .attr("class", "tile")
        .attr("data-name", movie => movie.data.name)
        .attr("data-category", movie => movie.data.category)
        .attr("data-value", movie => movie.data.value)
        .attr("width", movie => movie.x1 - movie.x0)
        .attr("height", movie => movie.y1 - movie.y0)
        .attr("fill", movie => {
          let genre = movie.data.category
          switch(genre) {
            case "Action":
              return colors[0];
            case "Drama":
              return colors[1]
            case "Adventure":
              return colors[2];
            case "Family":
              return colors[3]
            case "Animation":
              return colors[4];
            case "Comedy":
              return colors[5]
            case "Biography":
              return colors[6];
          }
        })
        .on("mouseover", function(e, movie) {
          tooltip.html(`${movie.data.name}<br>Genre: ${movie.data.category}<br>Sales: $${d3.format(",")(movie.data.value)}`)
          tooltip.attr("data-value", movie.data.value)
          tooltip.style("visibility", "visible")
        })
        .on("mousemove", function() {
          tooltip.style("top", (event.pageY - 20)+"px")
                  .style("left",(event.pageX + 20)+"px")
        })
        .on("mouseleave", function() {
          tooltip.style("visibility", "hidden")
        })

    block.append("text")
          .attr("class", "tile-text")
          .text(movie => movie.data.name)
          .attr("y", 20)
          .attr("x", 5)

    // Legend
    const genres = ["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"]

    const legend = svg.append("g")
                      .attr("id", "legend")
                      .attr("transform", `translate(0, ${h - 50})`)

    const legendItems = legend.selectAll("g")
                              .data(genres)
                              .enter()
                              .append("g")
                              .attr("transform", (genre, i) => `translate(${(i*w/7) + (w/7/2)}, 0)`)

    // Square icon for legend
    legendItems.append("rect")
                .attr("class", "legend-item")
                .attr("fill", (genre, i) => colors[i])
                .attr("height", 30)
                .attr("width", 30)
                .attr("transform", "translate(-50, -15)")

    // Labels for legend
    legendItems.append("text")
                .text(genre => genre)
                .attr("transform", "translate(0, 5)")
  }

// Fetch data
d3.json(dataUrl).then(
  (data, error) => {
    if(error) {
      console.log(error)
    } else {
      movieData = data
      drawTreeMap()
    }
  }
)
