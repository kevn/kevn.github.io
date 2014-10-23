source "https://rubygems.org"
gem 'jekyll', '~>2.4.0'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
