class CreateSailorRaceDays < ActiveRecord::Migration
  def change
    create_table :sailor_race_days do |t|
      t.belongs_to :sailor, :null => false, :index => true
      t.belongs_to :race_day, :null => false, :index => true
      t.string :division, :null => false
      t.string :override_next_division
      t.timestamps :null => false
    end
  end
end
