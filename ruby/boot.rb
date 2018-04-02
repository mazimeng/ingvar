require 'net/http'
require_relative 'config/environment'
require_relative 'html'



# uri = URI('https://thepiratebay.org/search/silicon%20valley%20s05e02/0/99/0')
# html = Net::HTTP.get(uri)
doc = Nokogiri::HTML(Ingvar::SAMPLE)
puts doc.xpath('//*[@id="searchResult"]')[0].attributes['id']