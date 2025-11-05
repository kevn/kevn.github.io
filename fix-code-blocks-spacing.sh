#!/bin/bash

# Properly add blank lines before and after code fences

for file in src/content/blog/*.md; do
  # Use sed to add blank lines around code fences
  sed -i '/^```/i\\
' "$file"  # Add blank line before ```

  sed -i '/^```/a\\
' "$file"  # Add blank line after ```

  # Remove duplicate blank lines (more than 2 consecutive)
  sed -i '/^$/N;/^\n$/D' "$file"

  echo "Fixed spacing: $(basename $file)"
done

echo "Code block spacing fixed!"
