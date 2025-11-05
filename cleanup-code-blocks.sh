#!/bin/bash

# Remove blank lines immediately after opening ``` and before closing ```

for file in src/content/blog/*.md; do
  # Remove blank line after opening ```LANG
  sed -i '/^```[a-z]*$/{ N; s/\n$//; s/^\(```[a-z]*\)\n$/\1/; }' "$file"

  # More aggressive: remove any blank line that comes right after ```
  awk '
    prev_was_open_fence = 0
    /^```[a-z]*$/ {
      print
      prev_was_open_fence = 1
      next
    }
    /^```$/ && prev_was_open_fence == 0 {
      # Closing fence - check if next line is blank
      print
      next
    }
    {
      # Skip blank line if previous was opening fence
      if (prev_was_open_fence && /^$/) {
        prev_was_open_fence = 0
        next
      }
      prev_was_open_fence = 0
      print
    }
  ' "$file" > "${file}.tmp"

  mv "${file}.tmp" "$file"
  echo "Cleaned: $(basename $file)"
done

echo "Code blocks cleaned!"
