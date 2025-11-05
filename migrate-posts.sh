#!/bin/bash

# Migrate Jekyll posts to Astro content collections

for post in _posts/*.markdown; do
  filename=$(basename "$post" .markdown)

  # Extract date from filename (YYYY-MM-DD-title format)
  date=$(echo "$filename" | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
  slug=$(echo "$filename" | sed "s/^${date}-//")

  # Extract title from frontmatter
  title=$(grep '^title:' "$post" | sed 's/^title: //' | sed 's/^"//' | sed 's/"$//')

  # Get content after frontmatter (after second ---)
  content=$(awk '/^---$/{p++; next} p==2' "$post")

  # Create new frontmatter
  cat > "src/content/blog/${filename}.md" <<EOF
---
title: "${title}"
date: ${date}T00:00:00-08:00
---

${content}
EOF

  echo "Migrated: $filename"
done

echo "Migration complete!"
