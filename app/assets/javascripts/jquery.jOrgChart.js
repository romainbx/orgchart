/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk
 *
 * Copyright (c) 2011 Wesley Nolte
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function($) {

  $.fn.refresh = function() {

    $('.chart-line').each(function(){
      $(this).remove();
    });

    drawLines();
  }

  $.fn.jOrgChart = function(options) {
    var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
    var $appendTo = $(opts.chartElement);

    // build the tree
    $this = $(this);
    var $container = $("<div class='" + opts.chartClass + "'/>");
    if (options.data)
      buildNode(options.data, $container, 0, opts);

    $appendTo.append($container);


		$container.css('width', 0);

		var right_node_la_plus_a_droite = 0;

    $(".node").each(function(){
      if((parseInt($(this).offset().top)-$('#chart').offset().top) > parseInt($container.css('height')))
        $container.css('height', parseInt($(this).offset().top));

      y = parseInt($(this).offset().left) + parseInt($(this).css('width')) - $('#chart').offset().left;

      if (y > right_node_la_plus_a_droite)
      	right_node_la_plus_a_droite = y;

      $container.css('width', '100%');
    });
    $("#chart").css('width', right_node_la_plus_a_droite);

    drawLines($container);
  };

  // Option defaults
  $.fn.jOrgChart.defaults = {
    chartElement : 'body',
    depth      : -1,
    chartClass : "jOrgChart",
    dragAndDrop: false
  };

  var nodeCount = 0;

  var arrayOfAlready = [];

  // Method that recursively builds the tree
  function buildNode($node, $appendTo, level, opts) {
    var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
    var $tbody = $("<tbody/>");

    // Construct the node container(s)
    var $nodeRow = $("<tr/>").addClass("node-cells");
    var $nodeCell = $("<td/>").addClass("node-cell").attr("colspan", 2);
    //var $childNodes = $node.children("ul:first").children("li");
    var $childNodes = $node.children;
    var $nodeDiv;

    if($childNodes && $childNodes.length > 1) {
      $nodeCell.attr("colspan", $childNodes.length * 2);
    }
    // Draw the node
    // Get the contents - any markup except li and ul allowed
    var $nodeContent = $node.title;

    title = $("<div class='title'>").append($node.title);
    english = $("<div class='translation'>").append($node.english);
    chinese = $("<div class='translation'>").append($node.chinese);
    comment = $("<div class='info'>").append($node.comment);

    //Increaments the node count which is used to link the source list and the org chart
  	nodeCount++;
  	//$node.data("tree-node", nodeCount);
  	$nodeDiv = $("<div>").data("tree-node", nodeCount).append(title, english, chinese, comment);
    $nodeDiv.attr('style', $node['decoration']);
    $nodeDiv.addClass("node");
    $nodeDiv.attr('id', 'p'+$node['id']);

    parentsIds=[];
    if ($node['parents'])
    {
    for (var i=0; i<$node['parents'].length; i++)
    {
      parentsIds.push($node['parents'][i]);
    }
    }
    $nodeDiv.attr('parents', parentsIds);
    $nodeDiv.attr('children', $node['children']);
    $nodeDiv.attr('node_type', $node['node_type']);
    $nodeDiv.attr('level', level);

    $nodeCell.append($nodeDiv);
    $nodeRow.append($nodeCell);
    $tbody.append($nodeRow);

    if($childNodes && $childNodes.length > 0) {
      // recurse until leaves found (-1) or to the level specified
      if(opts.depth == -1 || (level+1 < opts.depth)) {
        var $downLineRow = $("<tr/>");
        var $downLineCell = $("<td/>").attr("colspan", $childNodes.length*2);
        $downLineRow.append($downLineCell);

        // draw the connecting line from the parent node to the horizontal line
        $downLine = $("<div></div>").addClass("line down");
        $downLineCell.append($downLine);
        $tbody.append($downLineRow);

        // Draw the horizontal lines
        var $linesRow = $("<tr/>");

        for (var i=0; i<$childNodes.length; i++)
        {
        //$childNodes.each(function() {
          var $left = $("<td>&nbsp;</td>").addClass("line left top");
          var $right = $("<td>&nbsp;</td>").addClass("line right top");
          $linesRow.append($left).append($right);
        }

        // horizontal line shouldn't extend beyond the first and last child branches
        $linesRow.find("td:first")
                    .removeClass("top")
                 .end()
                 .find("td:last")
                    .removeClass("top");

        $tbody.append($linesRow);
        var $childNodesRow = $("<tr/>");

        if ($node['node_type'] == "pile")
        {
           var $td = $("<td class='node-container'/>");
           $td.attr("colspan",2);
           var $bigDiv = $("<div>");
           $bigDiv.css('position', 'absolute');
           $bigDiv.css('width', 400);
           $bigDiv.css('margin-left', 40);

           for (var i=0; i<$childNodes.length; i++)
           {
              child = $childNodes[i];

              title = $("<div class='title'>").append(child.title);
              english = $("<div class='translation'>").append(child.english);
              chinese = $("<div class='translation'>").append(child.chinese);
              comment = $("<div class='info'>").append(child.comment);
              $newDiv = $("<span>").addClass("node").append(title, english, chinese, comment);
              $newDiv.attr('style', child['decoration']);
              if (child['id']) $newDiv.attr('id', child['id']);
              if (child['parents']) $newDiv.attr('parents', child['parents']);
              if (child['node_type']) $newDiv.attr('node_type', child['node_type']);

              $newDiv.css('width', '100%');
              $newDiv.css('margin-bottom', 5);
              $newDiv.css('left', 30);
              $newDiv.css('text-align', 'left');

              $bigDiv.append($newDiv);
           }
           $td.append($bigDiv);
           $childNodesRow.append($td);
        }
        else
        {
          for (var i=0; i<$childNodes.length; i++)
          {
            child = $childNodes[i];
            var $td = $("<td class='node-container'/>");
            $td.attr("colspan", 2);

            if (jQuery.inArray(child['id'], arrayOfAlready) == -1)
            {
              arrayOfAlready.push(child['id']);
              buildNode(child, $td, level+1, opts);
              $childNodesRow.append($td);
            }
          }
        }
      }
      $tbody.append($childNodesRow);
    }

    $table.append($tbody);
    $appendTo.append($table);
  };

  drawLines = function(container) {

    arrayOfAlready = [];

    topOffset = $('#chart').offset().top - 8;
    leftOffset = $('#chart').offset().left;

    $('.node').each(function(){
      coord = $(this).offset();

      // Case of a pile of nodes
      if ($(this).attr('node_type') == "pile-son")
      {
        $parent = $('div#p'+$(this).attr('parents'));
        $parentCoord = $parent.offset();

        // Line to the left
        $leftLine = $("<div>");
        $leftLine.css('position', 'absolute');
        $leftLine.css('border-top', '2px solid #AAA');
        $leftLine.css('top', coord.top - topOffset + 18);
        $leftLine.css('left', coord.left - 28 - leftOffset);
        $leftLine.css('width', 28);
        $leftLine.css('height', 2);
        $('#chart').append($leftLine);

        // Line to the parent
        var bas_du_parent = $parentCoord.top + parseInt($parent.css('height')) + 16;
        $lineToParent = $("<div>");
        $lineToParent.css('position', 'absolute');
        $lineToParent.css('border-left', '2px solid #AAA');
        $lineToParent.css('top', bas_du_parent - topOffset);
        $lineToParent.css('left', coord.left - 28 - leftOffset);
        $lineToParent.css('width', 20);
        $lineToParent.css('height', Math.abs(coord.top - bas_du_parent) + 20);
        $('#chart').append($lineToParent);

        return;
      }

      // Links to the bottom line of the parent
      if ($(this).attr('parents'))
      {
        $nodeJonctionLine = $("<div>").addClass('chart-line');
        $nodeJonctionLine.css('position', 'absolute');
        $nodeJonctionLine.css('border-left', '2px solid #AAA');
        $nodeJonctionLine.css('top', coord.top - 28 - topOffset);
        $nodeJonctionLine.css('left', coord.left + parseInt($(this).css('width'))/2 - leftOffset);
        $nodeJonctionLine.css('width', 2);
        $nodeJonctionLine.css('height', 20);
        container.append($nodeJonctionLine);

        // We do the lines for each parents
        var myArray = $(this).attr('parents').split(',');
        for(var i=0; i<myArray.length; i++) {
          $parent = $('div#p'+myArray[i]);
          $parentCoord = $parent.offset();

          // bottomLine
          var topMiddle = coord.left + parseInt($(this).css('width'))/2;
          var parentMiddle = $parentCoord.left + parseInt($parent.css('width'))/2;
          $nodeHLine = $("<div>").addClass('chart-line');
          $nodeHLine.css('position', 'absolute');
          $nodeHLine.css('border-top', '2px solid #AAA');
          $nodeHLine.css('top', coord.top-28 - topOffset);
          $nodeHLine.css('width', Math.abs(parentMiddle - topMiddle));

          if (parentMiddle < topMiddle)
            $nodeHLine.css('left', parentMiddle - leftOffset);
          else
            $nodeHLine.css('left', coord.left + parseInt($(this).css('width'))/2 - leftOffset);

          container.append($nodeHLine);

          // Line between the horizontal line and the parent
          var bas_du_parent = $parentCoord.top + parseInt($parent.css('height'));
          var top_trait_horizontal_parent = coord.top - 42;
          $nodeJonctionLine = $("<div>").addClass('chart-line');
          $nodeJonctionLine.css('position', 'absolute');
          $nodeJonctionLine.css('top', $parentCoord.top + parseInt($parent.css('height')) + 16 - topOffset);
          $nodeJonctionLine.css('border-left', '2px solid #AAA');
          $nodeJonctionLine.css('left', parentMiddle - leftOffset);
          $nodeJonctionLine.css('width', 2);
          $nodeJonctionLine.css('height', Math.abs(top_trait_horizontal_parent - bas_du_parent));
          container.append($nodeJonctionLine);

        }
      }

    });
  };
})(jQuery);
