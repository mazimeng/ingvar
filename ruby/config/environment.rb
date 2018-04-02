require 'erb'

ENV['RACK_ENV'] ||= 'development'

# load gems
Bundler.require :default, ENV['RACK_ENV']

# project skeleton
module Ingvar
end
