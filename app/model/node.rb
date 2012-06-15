class Node < ActiveRecord::Base

  attr_accessible :title, :english, :chinese, :comment, :chart_id, :decoration, :node_type

  belongs_to :chart

  has_and_belongs_to_many :parents, :class_name=>'Node', :join_table => "parents_children", :foreign_key => :child_id, :association_foreign_key => :parent_id
  has_and_belongs_to_many :children, :class_name=>'Node', :join_table => "parents_children", :foreign_key => :parent_id, :association_foreign_key => :child_id

  def as_json(options={})
      options = {:include => [:parents,:children]}.merge(options)
      super(options)
  end
end
