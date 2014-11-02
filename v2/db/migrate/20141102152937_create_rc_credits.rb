class CreateRcCredits < ActiveRecord::Migration
  def change
    create_table :rc_credits do |t|
      t.belongs_to :race_day, :null => false, :index => true
      t.belongs_to :sailor, :null => false, :index => true
      t.timestamps :null => false
    end
  end
end
