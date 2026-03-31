import base64
import io
from PIL import Image
from rembg import remove


def remove_background(input_bytes: bytes) -> list[dict]:
    """Remove background from image and return foreground + background layers."""

    # Load original image
    original = Image.open(io.BytesIO(input_bytes)).convert("RGBA")
    width, height = original.size

    # Remove background -> foreground with alpha
    foreground_bytes = remove(input_bytes)
    foreground = Image.open(io.BytesIO(foreground_bytes)).convert("RGBA")

    # Create background layer (original with foreground area made transparent)
    # Simple approach: use the inverse of the foreground alpha as background alpha
    fg_alpha = foreground.split()[3]
    background = original.copy()
    bg_alpha = background.split()[3]

    # Where foreground is opaque, make background transparent
    from PIL import ImageChops
    inv_alpha = ImageChops.invert(fg_alpha)
    background.putalpha(inv_alpha)

    # Encode to base64 PNG
    def to_base64(img: Image.Image) -> str:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")

    return [
        {
            "name": "背景",
            "image_base64": to_base64(background),
            "bounds": {"x": 0, "y": 0, "w": width, "h": height},
        },
        {
            "name": "前景",
            "image_base64": to_base64(foreground),
            "bounds": {"x": 0, "y": 0, "w": width, "h": height},
        },
    ]
