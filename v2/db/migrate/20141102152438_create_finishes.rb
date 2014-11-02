class CreateFinishes < ActiveRecord::Migration
  def change
    create_table :finishes do |t|
      t.belongs_to :sailor_race_day, :null => false, :index => true
      t.belongs_to :race, :null => false, :index => true
      t.string :score, :null => false
      t.timestamps :null => false
    end
  end
end
