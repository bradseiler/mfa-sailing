class CreateSailors < ActiveRecord::Migration
  def change
    create_table :sailors do |t|
      t.string :first_name, :null => false
      t.string :last_name, :null => false
      t.string :email
      t.integer :large_sail
      t.integer :small_sail
      t.boolean :active, :default => true
      t.timestamps :null => false
    end
  end
end
