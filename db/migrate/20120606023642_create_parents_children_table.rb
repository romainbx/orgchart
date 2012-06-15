class CreateParentsChildrenTable < ActiveRecord::Migration
  def up
    create_table :parents_children, :id => false do |t|
      t.column :child_id, :integer, :null => false
      t.column :parent_id, :integer, :null => false
    end
    add_index :parents_children, [:child_id, :parent_id]
  end

  def down
    drop_table :parents_children
  end
end
