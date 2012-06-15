class CreateNodes < ActiveRecord::Migration
  def up
    create_table :nodes do |t|
      t.string :title, :null => false
      t.string :english
      t.string :chinese
      t.string :comment
      t.text :decoration
      t.references :chart, :null => false
    end
  end

  def down
     drop_table "nodes"
  end
end
