class Base
  def initialize(name)
    @name = name
  end
  def morning
    "good morning, " + @name
  end
  def evening
    "good evening, " + @name
  end
end
class Japan < Base
  def morning
    @name + "-san, ohayou"
  end
end
tanaka = Japan.new("tanaka")
puts tanaka.morning # => tanaka-san, ohayou
puts tanaka.evening # => good evening, tanaka
