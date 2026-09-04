"""Script to generate high-resolution favicons for Automação de Conciliação de Faturas e Pedidos."""
from pathlib import Path
import shutil
from PIL import Image, ImageDraw

def lerp(c1, c2, factor):
    return int(c1 + (c2 - c1) * factor)

def create_conciliacao_favicon(size: int = 256) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    c_top = (20, 184, 166)      # #14b8a6 (Teal)
    c_mid = (37, 99, 235)       # #2563eb (Blue)
    c_bot = (15, 23, 42)        # #0f172a (Dark Slate)

    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.22)
    mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)

    grad = Image.new("RGBA", (size, size))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(size):
        ratio = y / float(size)
        if ratio < 0.5:
            f = ratio / 0.5
            r = lerp(c_top[0], c_mid[0], f)
            g = lerp(c_top[1], c_mid[1], f)
            b = lerp(c_top[2], c_mid[2], f)
        else:
            f = (ratio - 0.5) / 0.5
            r = lerp(c_mid[0], c_bot[0], f)
            g = lerp(c_mid[1], c_bot[1], f)
            b = lerp(c_mid[2], c_bot[2], f)
        grad_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    img.paste(grad, (0, 0), mask)

    border_draw = ImageDraw.Draw(img)
    border_draw.rounded_rectangle(
        [1, 1, size - 2, size - 2],
        radius=radius,
        outline=(255, 255, 255, 45),
        width=max(1, int(size * 0.02))
    )

    scale = size / 64.0
    line_color = (223, 252, 246, 230)
    line_w = max(1, int(4 * scale))

    border_draw.line([(17 * scale, 22 * scale), (33 * scale, 22 * scale)], fill=line_color, width=line_w)
    border_draw.line([(17 * scale, 30 * scale), (29 * scale, 30 * scale)], fill=line_color, width=line_w)
    border_draw.line([(35 * scale, 42 * scale), (47 * scale, 42 * scale)], fill=line_color, width=line_w)
    border_draw.line([(27 * scale, 34 * scale), (35 * scale, 34 * scale)], fill=line_color, width=line_w)

    arrow_color = (255, 255, 255, 255)
    border_draw.line([(43 * scale, 18 * scale), (51 * scale, 18 * scale)], fill=arrow_color, width=int(4 * scale))
    border_draw.line([(51 * scale, 18 * scale), (51 * scale, 26 * scale)], fill=arrow_color, width=int(4 * scale))

    pts = []
    steps = 30
    for i in range(steps + 1):
        t = i / float(steps)
        x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 28 + t ** 2 * 48
        y = (1 - t) ** 2 * 43 + 2 * (1 - t) * t * 19 + t ** 2 * 21
        pts.append((x * scale, y * scale))
    for i in range(len(pts) - 1):
        border_draw.line([pts[i], pts[i + 1]], fill=(167, 243, 208, 255), width=int(5 * scale))

    r_node = 4 * scale
    border_draw.ellipse(
        [(20 * scale - r_node, 43 * scale - r_node), (20 * scale + r_node, 43 * scale + r_node)],
        fill=(255, 255, 255, 255)
    )
    border_draw.ellipse(
        [(48 * scale - r_node, 21 * scale - r_node), (48 * scale + r_node, 21 * scale + r_node)],
        fill=(167, 243, 208, 255)
    )

    return img

def main():
    root = Path(__file__).resolve().parents[1]
    public_dir = root / "dashboard" / "public"
    public_dir.mkdir(parents=True, exist_ok=True)

    master = create_conciliacao_favicon(256)

    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [master.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]

    png_64 = master.resize((64, 64), Image.Resampling.LANCZOS)

    ico_images[0].save(
        str(public_dir / "favicon.ico"),
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_images[1:],
    )
    png_64.save(str(public_dir / "favicon.png"), format="PNG")

    ico_images[0].save(
        str(root / "favicon.ico"),
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_images[1:],
    )
    png_64.save(str(root / "favicon.png"), format="PNG")

    svg_source = public_dir / "favicon.svg"
    if svg_source.exists():
        shutil.copy(str(svg_source), str(root / "favicon.svg"))

    print("Favicons gerados com sucesso para Automação de Conciliação!")

if __name__ == "__main__":
    main()
