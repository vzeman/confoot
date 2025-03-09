#!/bin/bash

# Script to update all googlemap shortcodes in content files
# Replaces address-based googlemap shortcodes with lat/lon based ones

# Průmyslová street coordinates
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Průmyslová 154, 674 01 Třebíč, Czech Republic" height="400px" zoom="15" >}}/{{< googlemap lat="49.2090954" lon="15.8932514" height="400px" zoom="15" >}}/g' {} \;
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Průmyslová 154, 674 01 Třebíč, Čekijos Respublika" height="400px" zoom="15" >}}/{{< googlemap lat="49.2090954" lon="15.8932514" height="400px" zoom="15" >}}/g' {} \;
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Průmyslová 154, 674 01 Třebíč, Tsjechje" height="400px" zoom="15" >}}/{{< googlemap lat="49.2090954" lon="15.8932514" height="400px" zoom="15" >}}/g' {} \;

# Slavníkova street coordinates
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Slavníkova 2357\/9, Břevnov, 169 00 Praha 6, Czech Republic" height="400px" zoom="15" >}}/{{< googlemap lat="50.0848364" lon="14.3623594" height="400px" zoom="15" >}}/g' {} \;
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Slavníkova 2357\/9, Břevnov, 169 00 Praha 6, Čekijos Respublika" height="400px" zoom="15" >}}/{{< googlemap lat="50.0848364" lon="14.3623594" height="400px" zoom="15" >}}/g' {} \;
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Slavníkova 2357\/9, Břevnov, 169 00 Praha 6, Tsjechje" height="400px" zoom="15" >}}/{{< googlemap lat="50.0848364" lon="14.3623594" height="400px" zoom="15" >}}/g' {} \;
find /Users/viktorzeman/work/confoot/content -type f -name "*.md" -exec sed -i '' 's/{{< googlemap address="Slavníkova 2357\/9, Břevnov, 169 00 Praga 6, Czech Republic" height="400px" zoom="15" >}}/{{< googlemap lat="50.0848364" lon="14.3623594" height="400px" zoom="15" >}}/g' {} \;

echo "All googlemap shortcodes have been updated to use lat/lon parameters!"
