#!/bin/bash

# Fix Jekyll template variables in posts

for file in src/content/blog/*.md; do
  # Replace {{ site.twitter_username }} with actual username
  sed -i 's/{{ site\.twitter_username }}/kev_in/g' "$file"

  # Replace {{ post_url ... }} with direct links
  # This is a simple regex - might need refinement for complex cases
  sed -i 's/{{ post_url \([0-9-]*\)-\([^}]*\) }}/\/\1\/\2.html/g' "$file"

  # Fix the year-month-day format in post_url links
  sed -i -E 's/\/([0-9]{4})-([0-9]{2})-([0-9]{2})\//\/\1\/\2\/\3\//g' "$file"

  echo "Fixed: $(basename $file)"
done

echo "Jekyll variables fixed!"
