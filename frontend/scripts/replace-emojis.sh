#!/bin/bash

# This script replaces emojis with Lucide React icon components
# Run this script from the project root

echo "Replacing emojis with Lucide icons..."

# Replace common emojis in all JSX files
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì≥Ö/<Calendar className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ìø∑Ô∏è/<Tag className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì±•/<Users className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/‚úì/<CheckCircle className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/‚≠ê/<Star className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/‚ù§Ô∏è/<Heart className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ìæ´/<Ticket className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ìæâ/<Calendar className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì≥ù/<FileText className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì¥î/<Bell className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/‚öôÔ∏è/<Settings className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/‚ùì/<HelpCircle className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì∫™/<LogOut className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ìø†/<Home className="size-4 inline mr-1" \/>/g' {} \;
find frontend/src -name "*.jsx" -type f -exec sed -i 's/Ì¥ç/<Search className="size-4 inline mr-1" \/>/g' {} \;

echo "‚úÖ Emojis replaced successfully!"
echo "‚ö†Ô∏è  Make sure to import the required icons in each file"
