#!/bin/bash

# Add blank lines around code fences for proper markdown parsing

for file in src/content/blog/*.md; do
  # Use awk to add blank lines before and after ``` markers
  awk '
    /^```/ {
      # If previous line was not blank, add blank line before
      if (NR > 1 && prev != "") print ""
      print
      in_code = !in_code
      next
    }
    {
      # If we just closed a code block and this line is not blank, add blank line
      if (prev ~ /^```/ && !in_code && $0 != "") {
        print ""
      }
      print
    }
    { prev = $0 }
  ' "$file" > "${file}.tmp"

  mv "${file}.tmp" "$file"
  echo "Fixed: $(basename $file)"
done

echo "Blank lines added around code blocks!"
