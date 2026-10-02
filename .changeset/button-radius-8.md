---
'@dettalia/design-system': patch
---

Buttons now have an 8px corner radius: the Figma token `radius/button` points to `radius/lg` (8px) instead of `radius/sm` (4px). MUI's default corner radius (`theme.shape.borderRadius`) is now mapped to `radius.sm`, so it stays 4px and only buttons change.
