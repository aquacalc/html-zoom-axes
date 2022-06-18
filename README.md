# html-zoom-axes
Use/modify Yan Holtz's 'straight' D3 zoom-and-pan example (https://d3-graph-gallery.com/graph/interactivity_zoom.html) to review details before porting a D3 viz in React to Svelte.
1.  Set the dimensions
     * svgWidth & svgHeight: whole chart area
     * the margins (with enough top & left for pH isolpleth labels)
     * width & height: content area (without the axes?)

2.  Build the svg
     * append to the parent div
     * set whole chart area: svgWidth & svgHeight
     * APPEND a g translated by the top & left margins

3.  Add the x- and y-axes
     * xScale range: [0, width]
     * yScale range: [height, 0]
     * APPEND another g to the svg for each axis
     (* translate xAxis by (0, height) -- why?)
     * call each axis with its -Scale

4.  Define the clip path (the drawing area)
     * append clip path to the svg
     * give it an id (like "clipRect")
     * append a rect to the svg
     * give it width, height, & [x, y,] -> [0, 0]

5a. Create the region that holds the content (the data)
     * append another g to the svg
    (* give it an id in dev to give it a visible border)
     * add the clip path as "url(#id-of-clipRect)"

5b. Add the content/data
     * ...selectAll...merge...append...scale...

6.  Define zoom behavior
     * zoom()
     * scaleExtent()
     * [NB] extent && translateExtent
     * .on('zoom', updateChart)

7.  Create the 'invisible' <rect> to catch mouse events
     * set width & height
     * translate ... 0, 0
     * CALL(ZOOM)

8.  Re-Scale the chart elements
     * apply the transform object to the rescale* function
     * pass the *Scale to rescale*()
     * call each axis on the new scale
     * -- RE-SCALE the objects in the containing area
       -- which is tied to the clipRect


^^^ How correctly translate this to Svelte? ^^^
