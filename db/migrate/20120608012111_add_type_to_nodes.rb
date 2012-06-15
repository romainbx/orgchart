class AddTypeToNodes < ActiveRecord::Migration
  def change
    add_column :nodes, :type, :string
  end
end
