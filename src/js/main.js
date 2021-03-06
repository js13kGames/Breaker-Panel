define("main",
       ["element",
        "svg",
        "powerSourceElement",
        "switchElement",
        "consumerElement",
        "circuitElement"],
       function(element, svg, powerSourceElement, switchElement, consumerElement, circuitElement) {
           "use strict";
          /**
           * This is the main entry point to my app. It loads the necessary modules and setup the game.
           *
           * @module main
           * @requires element
           * @requires svg
           * @requires electronics/powerSourceElement
           * @requires electronics/switchElement
           * @requires electronics/consumerElement
           * @requires electronics/circuitElement
           */
           var game, grid, getRandomTile, tile, el, elements, usedTiles, animatePathes;
           var explanations, explanation, explanationSvg, i, len, circuit;

           /*
            * I am placing a grid on top of the viewport. Each tile should be 25x25.
            * ASCII for a better understanding:
            * (  0,  0) -- ( 25,  0) -- ( 50,  0) -- ( 75,  0) -- (100,  0)
            *     |            |            |            |            |
            * (  0, 25) -- ( 25, 25) -- ( 50, 25) -- ( 75, 25) -- (100, 25)
            *     |            |            |            |            |
            * (  0, 50) -- ( 25, 50) -- ( 50, 50) -- ( 75, 50) -- (100, 50)
            *     |            |            |            |            |
            * (  0, 75) -- ( 25, 75) -- ( 50, 75) -- ( 75, 75) -- (100, 75)
            *     |            |            |            |            |
            * (  0,100) -- ( 25,100) -- ( 50,100) -- ( 75,100) -- (100,100)
            */
           grid = [
               [  0,   0,  25, 25], [ 25,  0, 50, 25], [ 50,  0, 75, 25], [ 75,  0,100, 25],
               [  0,  25,  25, 50], [ 25, 25, 50, 50], [ 50, 25, 75, 50], [ 75, 25,100, 50],
               [  0,  50,  25, 75], [ 25, 50, 50, 75], [ 50, 50, 75, 75], [ 75, 50,100, 75],
               [  0,  75,  25,100], [ 25, 75, 50,100], [ 50, 75, 75,100], [ 75, 75,100,100]
           ];

           /*
            * Pick one tile out of those by random
            */
           getRandomTile = function(grid) { return grid[Math.floor(grid.length * Math.random(grid.length))]; };
           usedTiles = [];

           /*
            * In order to use the render method by referencing the element with string, keep them in a dict.
            */
           elements = {
               PowerSourceElement: new powerSourceElement.PowerSourceElement(),
               SwitchElement: new switchElement.SwitchElement(),
               ConsumerElement: new consumerElement.ConsumerElement(),
           };
           /*
            * I don't want to iterate over circuit as well.
            */
           circuit = new circuitElement.CircuitElement();
           /*
            * This connects the electronic elements with each other.
            */
           elements.SwitchElement.setInput(elements.PowerSourceElement).setOutput(elements.ConsumerElement);

           for (el in elements) {
               if (elements.hasOwnProperty(el)) {
                   /*
                    * It was meant to pick an unused tile out of the grid, but I experienced some bugs here.
                    * Especially some tiles seemed to be used several times :-/
                    */
                   do {
                       tile = getRandomTile(grid);
                   } while (usedTiles.indexOf(tile + '') !== -1);
                   usedTiles.push(tile + '');
                   /*
                    * Declare this element part of my circuit.
                    */
                   circuit.add(elements[el]);
                   /*
                    * And render it on the surface with tile as bounding box.
                    */
                   svg.el.appendChild(svg.render(elements[el], {bb: tile}));
               }
           }
           /*
            * Connect the electronic elements with cables.
            */
           svg.el.appendChild(svg.tie({
               from: elements.PowerSourceElement,
               to: elements.SwitchElement,
           }));
           svg.el.appendChild(svg.tie({
               from: elements.SwitchElement,
               to: elements.ConsumerElement,
           }));

           /*
            * And add everything to the DOM.
            */
           game = document.getElementById("game");
           game.appendChild(svg.el);

           /*
            * Depending on the state of the switch, open or close the circuit.
            */
           animatePathes = function() {
               var pathes, path, i, len;
               pathes = document.getElementsByTagName("path");
               for (i = 0, len = pathes.length; i < len; i += 1) {
                   path = pathes[i];
                   if (circuit.isClosed()) {
                       path.setAttribute("class", "live");
                   } else {
                       path.setAttribute("class", "");
                   }
               }
           };
           /*
            * Use the switch when hit.
            */
           game.addEventListener('click', function(event) {
               var group;
               group = event.target.parentElement;
               try {
                   if (group.nodeName === "g" && group.getAttribute("class") === "switch") {
                       elements.SwitchElement.useSwitch();
                   }
               } catch (e) {}
               animatePathes();
           });
           /*
            * Enforce changes on SVG be painted on the screen.
            */
           svg.el.outerHTML = svg.el.outerHTML;

           /*
            * Reuse above elements in the help area for explanations.
            */
           explanations = document.getElementsByClassName("explanation");
           for (i = 0, len = explanations.length; i < len; i += 1) {
               explanation = explanations[i];
               explanationSvg = explanation.firstElementChild;
               explanationSvg.appendChild(svg.render(elements[explanation.dataset.electronic + "Element"],
                                                     {bb: [0, 0, 25, 25]}));
               explanationSvg.outerHTML = explanationSvg.outerHTML;  // Enforce repaint
           }
          return {};
       }
);
