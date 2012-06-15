module Orgchartgem
  module ChartsHelper
    private

    def chartNodes(chartId)

      origin = Node.all(
        :conditions => ["chart_id = ?", chartId],
        :joins => 'LEFT JOIN "parents_children" ON "parents_children"."child_id" = "nodes"."id"',
        :group => "parent_id",
        :having => "count(parent_id) <= 0").first

      return buildOrg(origin).to_json if origin
    end

    def buildOrg(node)
      children = []
      if node.children
        node.children.each do |child|
          children << buildOrg(child)
        end
      end
      parents = []
      if node.parents
        node.parents.each do |parent|
          parents << parent.id
        end
      end

      obj = {
        :id => node.id,
        :title => node.title,
        :english => node.english,
        :chinese => node.chinese,
        :comment => node.comment,
        :decoration => node.decoration,
        :node_type => node.node_type,
        :children => children,
        :parents => parents
      }
      return obj
    end
  end
end
