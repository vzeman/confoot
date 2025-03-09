---
title: "Image Processing Test"
date: 2025-03-09
draft: false
---

## Image Processing Test

This page tests the image processing functionality to ensure all required sizes and WebP versions are generated.

### Using picture.html partial:

{{< rawhtml >}}
{{ partial "picture.html" (dict 
  "src" "img/logo.png" 
  "alt" "ConFoot Logo" 
  "class" "test-image"
) }}
{{< /rawhtml >}}

### Using lazyimg.html partial:

{{< rawhtml >}}
{{ partial "lazyimg.html" (dict 
  "src" "img/logo.png" 
  "alt" "ConFoot Logo" 
  "class" "test-image"
) }}
{{< /rawhtml >}}
