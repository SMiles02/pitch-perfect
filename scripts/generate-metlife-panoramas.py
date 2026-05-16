#!/usr/bin/env python3
"""
Build equirectangular (2:1) panoramas for Photo Sphere Viewer from MetLife Stadium photos.
Sources (CC-licensed, see public/panoramas/metlife/ATTRIBUTION.txt):
  - Wikimedia: MetLife Stadium, 2013 ICC (Alen Ištoković, CC BY 3.0)
  - Wikimedia: Arsenal vs Man U at MetLife, July 2023
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter, ImageEnhance

OUT_W, OUT_H = 4096, 2048
METLIFE_DIR = Path(__file__).resolve().parent.parent / "public" / "panoramas" / "metlife"

# Crop boxes as fractions of source image: (left, top, right, bottom)
SECTION_CROPS = {
    "101": (0.12, 0.38, 0.88, 0.92),  # lower bowl — field prominent
    "201": (0.18, 0.28, 0.82, 0.78),  # club level — balanced view
    "301": (0.08, 0.05, 0.92, 0.55),  # upper deck — wide stadium vista
    "401": (0.0, 0.22, 0.45, 0.82),   # corner — sideline angle
}


def load_sources() -> list[Image.Image]:
    paths = [
        METLIFE_DIR / "metlife_source.jpg",
        METLIFE_DIR / "metlife_arsenal_2023.jpg",
    ]
    images: list[Image.Image] = []
    for p in paths:
        if p.exists():
            images.append(Image.open(p).convert("RGB"))
    if not images:
        raise SystemExit(f"No source images in {METLIFE_DIR}")
    return images


def crop_fraction(img: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = img.size
    l, t, r, b = box
    return img.crop((int(l * w), int(t * h), int(r * w), int(b * h)))


def fill_band(color: tuple[int, int, int], width: int, height: int) -> Image.Image:
    return Image.new("RGB", (width, height), color)


def average_color(img: Image.Image, region: tuple[int, int, int, int]) -> tuple[int, int, int]:
    crop = img.crop(region)
    small = crop.resize((1, 1), Image.LANCZOS)
    return small.getpixel((0, 0))


def to_equirectangular(crop: Image.Image, band_height_ratio: float = 0.42, y_center: float = 0.52) -> Image.Image:
    """Place a stadium crop on a 2:1 equirectangular canvas with sky/stand filler."""
    out = Image.new("RGB", (OUT_W, OUT_H), (12, 18, 28))

    band_h = int(OUT_H * band_height_ratio)
    # Wider than tall crop → stretch to full panorama width (wraps at sides in viewer)
    crop_wide = crop.resize((OUT_W, band_h), Image.LANCZOS)
    crop_wide = ImageEnhance.Contrast(crop_wide).enhance(1.08)
    crop_wide = ImageEnhance.Color(crop_wide).enhance(1.12)

    y = int(OUT_H * y_center - band_h / 2)
    y = max(0, min(y, OUT_H - band_h))
    out.paste(crop_wide, (0, y))

    # Sky gradient from top of crop
    sky_h = y
    if sky_h > 0:
        top_color = average_color(crop_wide, (0, 0, OUT_W, max(1, band_h // 8)))
        sky = fill_band(top_color, OUT_W, sky_h)
        # Soft blend
        sky = sky.filter(ImageFilter.GaussianBlur(radius=min(40, sky_h // 4)))
        out.paste(sky, (0, 0))

    # Lower stands / crowd fade
    bottom_y = y + band_h
    bottom_h = OUT_H - bottom_y
    if bottom_h > 0:
        bottom_color = average_color(crop_wide, (0, band_h - max(1, band_h // 8), OUT_W, band_h))
        bottom = fill_band(
            tuple(max(0, c - 30) for c in bottom_color),
            OUT_W,
            bottom_h,
        )
        bottom = bottom.filter(ImageFilter.GaussianBlur(radius=min(30, bottom_h // 4)))
        out.paste(bottom, (0, bottom_y))

    return out


def main() -> None:
    sources = load_sources()
    primary = sources[0]
    secondary = sources[1] if len(sources) > 1 else primary

    for section_id, box in SECTION_CROPS.items():
        src = secondary if section_id == "401" and len(sources) > 1 else primary
        if section_id == "401" and len(sources) > 1:
            # Portrait match photo — crop center stands view
            crop = crop_fraction(src, (0.05, 0.25, 0.95, 0.75))
        else:
            crop = crop_fraction(src, box)

        y_center = {"101": 0.58, "201": 0.52, "301": 0.45, "401": 0.5}.get(section_id, 0.52)
        band = {"101": 0.48, "201": 0.44, "301": 0.40, "401": 0.46}.get(section_id, 0.42)

        pano = to_equirectangular(crop, band_height_ratio=band, y_center=y_center)
        out_path = METLIFE_DIR / f"section_{section_id}.jpg"
        pano.save(out_path, "JPEG", quality=88, optimize=True)
        print(f"Wrote {out_path} ({pano.size[0]}x{pano.size[1]})")

    attribution = METLIFE_DIR / "ATTRIBUTION.txt"
    attribution.write_text(
        "MetLife Stadium panorama sources (hackathon demo):\n\n"
        "1. Metlife Stadium, 2013 Soccer International Champions Cup\n"
        "   Alen Ištoković — CC BY 3.0\n"
        "   https://commons.wikimedia.org/wiki/File:Metlife_Stadium,_2013_Soccer_International_Champions_Cup_-_panoramio_(1).jpg\n\n"
        "2. Arsenal Man U Metlife Stadium July 2023\n"
        "   https://commons.wikimedia.org/wiki/File:Arsenal_Man_U_Metlife_Stadium_July_2023.jpg\n\n"
        "Section panoramas are derived crops formatted as equirectangular 2:1 for Photo Sphere Viewer.\n",
        encoding="utf-8",
    )
    print(f"Wrote {attribution}")


if __name__ == "__main__":
    main()
