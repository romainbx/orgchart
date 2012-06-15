class CreateCharts < ActiveRecord::Migration
  def change
    create_table :charts do |t|
      t.string :title, :null => false
      t.string :english
      t.string :chinese
      t.text :content

      t.timestamps
    end
  end
end
