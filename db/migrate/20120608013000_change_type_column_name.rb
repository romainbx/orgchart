class ChangeTypeColumnName < ActiveRecord::Migration
  def up
    rename_column :nodes, :type, :node_type
  end

  def down
  end
end
