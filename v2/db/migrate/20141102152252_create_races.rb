class CreateRaces < ActiveRecord::Migration
  def change
    create_table :races do |t|
      t.belongs_to :race_day, :null => false, :index => true
      t.string :division, :null => false
      t.integer :sailors_starting, :null => false
      t.integer :start_number, :null => false
      t.timestamps :null => false
    end
  end
end
