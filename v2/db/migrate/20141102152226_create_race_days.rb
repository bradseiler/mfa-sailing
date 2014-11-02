class CreateRaceDays < ActiveRecord::Migration
  def change
    create_table :race_days do |t|
      t.string :season, :null => false, :index => true
      t.belongs_to :regatta, :index => true
      t.date :date, :null => false
      t.timestamps :null => false
    end
  end
end
