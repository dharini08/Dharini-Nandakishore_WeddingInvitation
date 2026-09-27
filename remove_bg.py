from PIL import Image

# Open the image
img = Image.open('images/elephant.png').convert("RGBA")
pixels = img.load()

# Define the colors we want to make transparent
# We will sample the top-left corner (usually background)
# Since it's a checkerboard, we can sample the first few pixels to get the two colors
bg_colors = set()
for x in range(20):
    for y in range(20):
        color = pixels[x, y]
        # Ignore if it has high variation (just to be safe)
        bg_colors.add((color[0], color[1], color[2]))

print(f"Detected background colors in top-left: {bg_colors}")

# Typically fake checkerboards are exact whites and greys.
# Common: (255, 255, 255) and (204, 204, 204) or similar light greys.
# Let's collect all colors that are purely grayscale (R==G==B) and very light (R > 200).
target_colors = set()
for r, g, b in bg_colors:
    if abs(r - g) < 5 and abs(g - b) < 5 and r > 180:
        target_colors.add((r, g, b))

print(f"Targeting colors for removal: {target_colors}")

if not target_colors:
    print("No checkerboard detected in the corner, exiting.")
else:
    # Pass over the whole image and remove matching colors with some tolerance
    width, height = img.size
    for x in range(width):
        for y in range(height):
            r, g, b, a = pixels[x, y]
            
            # Check against target colors
            for tr, tg, tb in target_colors:
                if abs(r - tr) < 10 and abs(g - tg) < 10 and abs(b - tb) < 10:
                    pixels[x, y] = (0, 0, 0, 0)
                    break
    
    img.save('images/elephant_transparent.png')
    print("Saved as elephant_transparent.png")
