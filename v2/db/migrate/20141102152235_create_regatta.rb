class CreateRegatta < ActiveRecord::Migration
  def change
    create_table :regatta do |t|
      t.integer :season, :null => false, :index => true
      t.string :name, :null => false
      t.timestamps :null => false
    end
  end
end
