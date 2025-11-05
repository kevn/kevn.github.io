#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def fix_code_blocks(content):
    """Add blank lines before and after code fences when mixing with HTML"""
    lines = content.split('\n')
    fixed_lines = []
    in_code = False

    for i, line in enumerate(lines):
        # Check if this is a code fence
        if line.strip().startswith('```'):
            is_opening = not in_code
            in_code = not in_code

            if is_opening:
                # Add blank line before opening fence if previous line isn't blank
                if fixed_lines and fixed_lines[-1].strip():
                    fixed_lines.append('')
                fixed_lines.append(line)
            else:
                # Closing fence
                fixed_lines.append(line)
                # Add blank line after closing fence if next line exists and isn't blank
                if i + 1 < len(lines) and lines[i + 1].strip():
                    fixed_lines.append('')
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

# Process all markdown files
blog_dir = Path('src/content/blog')
for md_file in blog_dir.glob('*.md'):
    content = md_file.read_text()
    fixed_content = fix_code_blocks(content)
    md_file.write_text(fixed_content)
    print(f"Fixed: {md_file.name}")

print("All files fixed!")
