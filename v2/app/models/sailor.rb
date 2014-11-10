class Sailor < ActiveRecord::Base
  default_scope ->
    where(:active => true)
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def sail_numbers
    "#{large_sail} #{small_sail}"
  end
end
