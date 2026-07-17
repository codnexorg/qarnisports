from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import random


OUT = Path(__file__).resolve().parents[1] / "public"
W, H = 1600, 1000


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def gradient_bg(accent: str, seed: int) -> Image.Image:
    random.seed(seed)
    accent_rgb = hex_to_rgb(accent)
    sw, sh = 320, 200
    img = Image.new("RGB", (sw, sh), "#06070d")
    px = img.load()
    for y in range(sh):
        for x in range(sw):
            nx = x / sw
            ny = y / sh
            v = 1 - math.sqrt((nx - 0.76) ** 2 + (ny - 0.45) ** 2)
            v = max(0, min(1, v))
            base = (
                lerp(4, 14, ny),
                lerp(5, 12, ny),
                lerp(12, 22, ny),
            )
            glow = tuple(int(c * (v ** 2) * 0.34) for c in accent_rgb)
            px[x, y] = tuple(min(255, base[i] + glow[i]) for i in range(3))

    img = img.resize((W, H), Image.Resampling.BICUBIC)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for i in range(32):
        x = int(W * (0.48 + random.random() * 0.5))
        y = int(H * random.random())
        alpha = random.randint(8, 20)
        draw.line([(x, 0), (x - random.randint(80, 220), H)], fill=(255, 255, 255, alpha), width=1)
    for radius, alpha in [(520, 48), (360, 34), (210, 26)]:
        cx = int(W * 0.76)
        cy = int(H * 0.5)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=(*accent_rgb, alpha), width=2)
    img = Image.alpha_composite(img.convert("RGBA"), overlay)
    return img


def blur_shadow(layer: Image.Image, amount: int = 24) -> Image.Image:
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    alpha = layer.split()[-1].filter(ImageFilter.GaussianBlur(amount))
    shadow.putalpha(alpha)
    black = Image.new("RGBA", (W, H), (0, 0, 0, 190))
    return Image.composite(black, shadow, alpha)


def paste_shape(bg: Image.Image, layer: Image.Image) -> Image.Image:
    bg = Image.alpha_composite(bg, blur_shadow(layer))
    return Image.alpha_composite(bg, layer)


def garment_colors(accent: str) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    a = hex_to_rgb(accent)
    fill = (
        min(255, 26 + int(a[0] * 0.28)),
        min(255, 30 + int(a[1] * 0.28)),
        min(255, 42 + int(a[2] * 0.28)),
        245,
    )
    return (*a, 245), fill


def draw_shirt(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str, long: bool = False, hoodie: bool = False, tank: bool = False):
    main, dark = garment_colors(accent)
    w = int(360 * scale)
    h = int(430 * scale)
    sleeve = int(95 * scale)
    if tank:
        poly = [(x + w * 0.30, y), (x + w * 0.70, y), (x + w * 0.84, y + h), (x + w * 0.16, y + h)]
    elif long:
        poly = [(x + w * 0.24, y + h * 0.08), (x + w * 0.76, y + h * 0.08), (x + w + sleeve, y + h * 0.72), (x + w * 0.78, y + h * 0.82), (x + w * 0.70, y + h), (x + w * 0.30, y + h), (x + w * 0.22, y + h * 0.82), (x - sleeve, y + h * 0.72)]
    else:
        poly = [(x + w * 0.22, y + h * 0.08), (x + w * 0.78, y + h * 0.08), (x + w + sleeve, y + h * 0.26), (x + w * 0.86, y + h * 0.48), (x + w * 0.76, y + h * 0.34), (x + w * 0.70, y + h), (x + w * 0.30, y + h), (x + w * 0.24, y + h * 0.34), (x + w * 0.14, y + h * 0.48), (x - sleeve, y + h * 0.26)]
    draw.polygon(poly, fill=dark)
    draw.line(poly + [poly[0]], fill=main, width=max(3, int(5 * scale)))
    draw.arc((x + int(w * 0.36), y, x + int(w * 0.64), y + int(h * 0.22)), 0, 180, fill=main, width=max(3, int(5 * scale)))
    draw.line((x + int(w * 0.5), y + int(h * 0.12), x + int(w * 0.5), y + int(h * 0.88)), fill=(255, 255, 255, 32), width=max(2, int(3 * scale)))
    if hoodie:
        draw.arc((x + int(w * 0.28), y - int(95 * scale), x + int(w * 0.72), y + int(130 * scale)), 190, 350, fill=main, width=max(6, int(10 * scale)))
        draw.rounded_rectangle((x + int(w * 0.34), y + int(h * 0.54), x + int(w * 0.66), y + int(h * 0.74)), radius=int(24 * scale), outline=main, width=max(3, int(4 * scale)))


def draw_shorts(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str):
    main, dark = garment_colors(accent)
    w = int(360 * scale)
    h = int(250 * scale)
    left = [(x, y), (x + w * 0.48, y), (x + w * 0.42, y + h), (x + w * 0.08, y + h)]
    right = [(x + w * 0.52, y), (x + w, y), (x + w * 0.92, y + h), (x + w * 0.58, y + h)]
    draw.polygon(left, fill=dark)
    draw.polygon(right, fill=dark)
    draw.line(left + [left[0]], fill=main, width=max(3, int(5 * scale)))
    draw.line(right + [right[0]], fill=main, width=max(3, int(5 * scale)))
    draw.line((x, y + int(30 * scale), x + w, y + int(30 * scale)), fill=main, width=max(3, int(5 * scale)))


def draw_leggings(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str):
    main, dark = garment_colors(accent)
    w = int(300 * scale)
    h = int(620 * scale)
    left = [(x, y), (x + w * 0.48, y), (x + w * 0.42, y + h), (x + w * 0.12, y + h)]
    right = [(x + w * 0.52, y), (x + w, y), (x + w * 0.88, y + h), (x + w * 0.58, y + h)]
    draw.polygon(left, fill=dark)
    draw.polygon(right, fill=dark)
    draw.line(left + [left[0]], fill=main, width=max(4, int(6 * scale)))
    draw.line(right + [right[0]], fill=main, width=max(4, int(6 * scale)))
    draw.line((x, y + int(45 * scale), x + w, y + int(45 * scale)), fill=main, width=max(4, int(6 * scale)))


def draw_bag(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str, duffle: bool = False):
    main, dark = garment_colors(accent)
    w = int(520 * scale)
    h = int(330 * scale)
    if duffle:
        draw.rounded_rectangle((x, y + h * 0.22, x + w, y + h), radius=int(90 * scale), fill=dark, outline=main, width=max(6, int(10 * scale)))
        draw.arc((x + w * 0.28, y, x + w * 0.72, y + h * 0.55), 185, 355, fill=main, width=max(8, int(14 * scale)))
        draw.line((x + w * 0.15, y + h * 0.46, x + w * 0.85, y + h * 0.46), fill=(255, 255, 255, 46), width=max(3, int(4 * scale)))
    else:
        draw.rounded_rectangle((x + w * 0.18, y + h * 0.15, x + w * 0.82, y + h), radius=int(45 * scale), fill=dark, outline=main, width=max(6, int(10 * scale)))
        draw.arc((x + w * 0.30, y, x + w * 0.70, y + h * 0.38), 185, 355, fill=main, width=max(7, int(12 * scale)))
        draw.line((x + w * 0.32, y + h * 0.15, x + w * 0.32, y + h), fill=(255, 255, 255, 45), width=max(3, int(4 * scale)))
        draw.line((x + w * 0.68, y + h * 0.15, x + w * 0.68, y + h), fill=(255, 255, 255, 45), width=max(3, int(4 * scale)))


def draw_ball(draw: ImageDraw.ImageDraw, x: int, y: int, r: int, accent: str, soccer: bool = False):
    main = (*hex_to_rgb(accent), 235)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(18, 20, 26, 238), outline=main, width=max(5, r // 22))
    if soccer:
        draw.polygon([(x, y - r * 0.45), (x + r * 0.42, y - r * 0.12), (x + r * 0.26, y + r * 0.42), (x - r * 0.26, y + r * 0.42), (x - r * 0.42, y - r * 0.12)], outline=main, fill=(8, 9, 14, 210))
        for a in range(0, 360, 72):
            ex = x + math.cos(math.radians(a)) * r * 0.78
            ey = y + math.sin(math.radians(a)) * r * 0.78
            draw.line((x, y, ex, ey), fill=main, width=max(3, r // 35))
    else:
        for off in (-0.35, 0, 0.35):
            draw.arc((x - r, y - r + int(off * r), x + r, y + r + int(off * r)), 18, 162, fill=main, width=max(3, r // 35))


def draw_hat(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str):
    main, dark = garment_colors(accent)
    w = int(430 * scale)
    h = int(210 * scale)
    draw.pieslice((x, y, x + w, y + h * 1.7), 180, 360, fill=dark, outline=main, width=max(4, int(7 * scale)))
    draw.ellipse((x + w * 0.34, y + h * 0.85, x + w * 1.12, y + h * 1.28), fill=dark, outline=main, width=max(4, int(7 * scale)))


def draw_bandage(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str):
    main, dark = garment_colors(accent)
    w = int(560 * scale)
    h = int(145 * scale)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=int(38 * scale), fill=dark, outline=main, width=max(4, int(7 * scale)))
    draw.rounded_rectangle((x + w * 0.39, y + h * 0.12, x + w * 0.61, y + h * 0.88), radius=int(18 * scale), fill=(255, 255, 255, 35), outline=main, width=max(3, int(4 * scale)))
    for i in range(4):
        draw.ellipse((x + w * (0.12 + i * 0.06), y + h * 0.38, x + w * (0.14 + i * 0.06), y + h * 0.52), fill=main)
        draw.ellipse((x + w * (0.74 + i * 0.06), y + h * 0.38, x + w * (0.76 + i * 0.06), y + h * 0.52), fill=main)


def draw_sports_bra(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str):
    main, dark = garment_colors(accent)
    w = int(420 * scale)
    h = int(290 * scale)
    draw.polygon([(x + w * 0.18, y), (x + w * 0.42, y + h * 0.48), (x + w * 0.36, y + h), (x + w * 0.05, y + h), (x + w * 0.03, y + h * 0.5)], fill=dark, outline=main)
    draw.polygon([(x + w * 0.82, y), (x + w * 0.58, y + h * 0.48), (x + w * 0.64, y + h), (x + w * 0.95, y + h), (x + w * 0.97, y + h * 0.5)], fill=dark, outline=main)
    draw.line((x + w * 0.08, y + h, x + w * 0.92, y + h), fill=main, width=max(6, int(10 * scale)))


def draw_uniform(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, accent: str, style: str):
    if style == "american":
        draw_shirt(draw, x, y, scale, accent, long=False)
        main = (*hex_to_rgb(accent), 235)
        draw.rounded_rectangle((x - 65 * scale, y + 50 * scale, x + 95 * scale, y + 175 * scale), radius=int(28 * scale), outline=main, width=max(5, int(8 * scale)), fill=(18, 22, 32, 230))
        draw.rounded_rectangle((x + 360 * scale, y + 50 * scale, x + 520 * scale, y + 175 * scale), radius=int(28 * scale), outline=main, width=max(5, int(8 * scale)), fill=(18, 22, 32, 230))
    else:
        draw_shirt(draw, x, y, scale, accent, tank=style == "basketball")
    draw_shorts(draw, x + int(55 * scale), y + int(455 * scale), scale * 0.74, accent)


def make(name: str, accent: str, kind: str, seed: int):
    bg = gradient_bg(accent, seed)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = 930, 220
    if kind == "t-shirt":
        draw_shirt(draw, x, y, 1.15, accent)
    elif kind == "hoodie":
        draw_shirt(draw, x, y + 20, 1.12, accent, hoodie=True)
    elif kind == "long-sleeve":
        draw_shirt(draw, x - 10, y + 20, 1.08, accent, long=True)
    elif kind == "leggings":
        draw_leggings(draw, x + 120, y - 10, 1.05, accent)
    elif kind == "shorts":
        draw_shorts(draw, x + 40, y + 220, 1.35, accent)
    elif kind == "soccer-uniform":
        draw_uniform(draw, x, y, 0.94, accent, "soccer")
        draw_ball(draw, 1370, 700, 115, accent, soccer=True)
    elif kind == "american-uniform":
        draw_uniform(draw, x, y, 0.9, accent, "american")
    elif kind == "basketball-uniform":
        draw_uniform(draw, x + 30, y, 0.96, accent, "basketball")
        draw_ball(draw, 1360, 680, 105, accent)
    elif kind == "volleyball-uniform":
        draw_uniform(draw, x + 25, y, 0.92, accent, "soccer")
        draw_ball(draw, 1370, 670, 95, accent)
    elif kind == "sports-bra":
        draw_sports_bra(draw, x + 60, y + 200, 1.25, accent)
    elif kind == "tank-top":
        draw_shirt(draw, x + 50, y + 20, 1.05, accent, tank=True)
    elif kind == "bag":
        draw_bag(draw, x + 10, y + 230, 1.05, accent)
    elif kind == "bandage":
        draw_bandage(draw, x + 10, y + 350, 1.05, accent)
    elif kind == "hat":
        draw_hat(draw, x + 40, y + 260, 1.18, accent)
    elif kind == "sports-bag":
        draw_bag(draw, x - 20, y + 260, 1.08, accent, duffle=True)
    elif kind == "soccer-ball":
        draw_ball(draw, 1220, 520, 245, accent, soccer=True)
    bg = paste_shape(bg, layer)
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(vignette)
    d.rectangle((0, 0, int(W * 0.55), H), fill=(0, 0, 0, 80))
    d.rectangle((0, int(H * 0.72), W, H), fill=(0, 0, 0, 62))
    bg = Image.alpha_composite(bg, vignette).convert("RGB")
    bg.save(OUT / f"{name}.webp", "WEBP", quality=88, method=6)


ITEMS = [
    ("category-t-shirts", "#c4a84f", "t-shirt"),
    ("category-hoodies", "#6bc4ff", "hoodie"),
    ("category-long-sleeve-shirts", "#8fd67f", "long-sleeve"),
    ("category-leggings", "#d56a9f", "leggings"),
    ("category-shorts", "#f08a5d", "shorts"),
    ("category-soccer-uniform", "#4CAF50", "soccer-uniform"),
    ("category-american-football-uniform", "#b879ff", "american-uniform"),
    ("category-basketball-uniform", "#e4773f", "basketball-uniform"),
    ("category-volleyball-uniform", "#48d1cc", "volleyball-uniform"),
    ("category-sports-bra", "#9C27B0", "sports-bra"),
    ("category-tank-tops", "#f0d080", "tank-top"),
    ("category-bags", "#7aa7ff", "bag"),
    ("category-bandages", "#ff6f91", "bandage"),
    ("category-hats", "#c4a84f", "hat"),
    ("category-sports-bags", "#52c7b8", "sports-bag"),
    ("category-soccer-ball", "#ffffff", "soccer-ball"),
]


for index, item in enumerate(ITEMS):
    make(*item, seed=1200 + index)

print(f"Generated {len(ITEMS)} category hero images in {OUT}")
