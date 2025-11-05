#!/bin/bash

# Convert Jekyll liquid highlight tags to markdown code fences

for file in src/content/blog/*.md; do
  # Create a temp file
  temp_file="${file}.tmp"

  # Convert {% highlight LANG %} to ```LANG
  # and {% endhighlight %} to ```
  sed 's/{% highlight \([a-z]*\) %}/```\1/g' "$file" | \
  sed 's/{% endhighlight %}/```/g' > "$temp_file"

  # Replace original file
  mv "$temp_file" "$file"

  echo "Converted: $(basename $file)"
done

echo "Conversion complete!"
