class CreateStartingDivisions < ActiveRecord::Migration
  def change
    create_table :starting_divisions do |t|
      t.belongs_to :sailor, :null => false, :index => true
      t.integer :season, :null => false
      t.string :division, :null => false
      t.timestamps :null => false
    end
  end
end
