import cv2
from PIL import Image, ImageDraw
import numpy as np

# 1. Load the user's raven icon
src = Image.open('raven-icon.png').convert('RGBA')
arr = np.array(src)
alpha = arr[:, :, 3]

# Extract contours for SVG
_, thresh = cv2.threshold(alpha, 128, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

# Calculate centering
all_pts = np.vstack([c.reshape(-1, 2) for c in contours])
min_x, min_y = all_pts.min(axis=0)
max_x, max_y = all_pts.max(axis=0)
cx = (min_x + max_x) / 2.0
cy = (min_y + max_y) / 2.0

dx = 256.0 - cx
dy = 256.0 - cy

path_segments = []
for cnt in contours:
    approx = cv2.approxPolyDP(cnt, 0.5, True)
    pts = approx.reshape(-1, 2)
    if len(pts) < 3:
        continue
    cmd = f"M {pts[0][0] + dx:.1f} {pts[0][1] + dy:.1f}"
    for pt in pts[1:]:
        cmd += f" L {pt[0] + dx:.1f} {pt[1] + dy:.1f}"
    cmd += " Z"
    path_segments.append(cmd)

full_path = " ".join(path_segments)

# SVG: Adaptive to browser theme (White on Dark tabs, Black on Light tabs)
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>
    .raven-path {{
      fill: #111116;
      transition: fill 0.2s ease;
    }}
    @media (prefers-color-scheme: dark) {{
      .raven-path {{
        fill: #ffffff;
      }}
    }}
  </style>
  <path class="raven-path" fill-rule="evenodd" d="{full_path}"/>
</svg>'''

with open('assets/icons/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print("Updated assets/icons/favicon.svg")

# 2. Build Centered Alpha Masters
# Centered image
centered_alpha = Image.new('L', (512, 512), 0)
alpha_img = Image.fromarray(alpha)
centered_alpha.paste(alpha_img, (int(round(dx)), int(round(dy))))

# A. White Raven (for dark themes)
white_master = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
white_arr = np.array(white_master)
white_arr[:, :, :3] = 255
white_arr[:, :, 3] = np.array(centered_alpha)
white_master = Image.fromarray(white_arr)

# B. Squircle Tile Master (for 192, 512, and universal app icons)
tile_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(tile_512)
draw.rounded_rectangle([20, 20, 492, 492], radius=110, fill=(13, 14, 18, 255), outline=(45, 48, 60, 255), width=8)

raven_tile_scaled = white_master.resize((380, 380), Image.Resampling.LANCZOS)
px = (512 - 380) // 2
py = (512 - 380) // 2
tile_512.paste(raven_tile_scaled, (px, py), raven_tile_scaled)

# Save 512 and 192 (Apple touch & PWA)
tile_512.save('assets/icons/favicon-512.png')
tile_192 = tile_512.resize((192, 192), Image.Resampling.LANCZOS)
tile_192.save('assets/icons/favicon-192.png')

# For 32 and 16, also save the crisp squircle tile which guarantees the white raven is clearly visible on every browser
tile_32 = tile_512.resize((32, 32), Image.Resampling.LANCZOS)
tile_32.save('assets/icons/favicon-32.png')

tile_16 = tile_512.resize((16, 16), Image.Resampling.LANCZOS)
tile_16.save('assets/icons/favicon-16.png')

# Generate favicon.ico with 16, 32, 48
tile_48 = tile_512.resize((48, 48), Image.Resampling.LANCZOS)
tile_48.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

print("Successfully built all favicon assets:")
print(" - assets/icons/favicon.svg (Adaptive SVG: white on dark tabs, dark on light tabs)")
print(" - assets/icons/favicon-512.png")
print(" - assets/icons/favicon-192.png")
print(" - assets/icons/favicon-32.png")
print(" - assets/icons/favicon-16.png")
print(" - favicon.ico")
