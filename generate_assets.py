import os
import shutil
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import fitz

root = Path.cwd()
assets = root / 'assets'
images_dir = assets / 'images'
cert_dir = assets / 'certificates'
gallery_dir = assets / 'gallery'
images_dir.mkdir(parents=True, exist_ok=True)
cert_dir.mkdir(parents=True, exist_ok=True)
gallery_dir.mkdir(parents=True, exist_ok=True)


def make_gradient(size, c1, c2):
    img = Image.new('RGB', size)
    draw = ImageDraw.Draw(img)
    width, height = size
    for y in range(height):
        ratio = y / max(height - 1, 1)
        r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
        g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
        b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
        draw.line((0, y, width, y), fill=(r, g, b))
    return img


def add_text_center(img, text, size, color, y_offset=0):
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', size)
    lines = textwrap.wrap(text, width=max(10, len(text) // 3)) if len(text) > 18 else [text]
    total_h = (len(lines) * (size + 6))
    start_y = img.size[1] // 2 - total_h // 2 + y_offset
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        width = bbox[2] - bbox[0]
        x = (img.size[0] - width) / 2
        y = start_y + i * (size + 6)
        draw.text((x, y), line, font=font, fill=color)


def make_placeholder(path, title, subtitle, bg1=(21, 31, 46), bg2=(87, 182, 175), accent=(246, 166, 106), text_color=(240, 246, 255)):
    img = make_gradient((900, 700), bg1, bg2)
    draw = ImageDraw.Draw(img)
    r = 140
    cx, cy = 240, 330
    draw.ellipse((cx-r, cy-r, cx+r, cy+r), fill=accent)
    for i in range(6):
        x = 510 + i * 45
        y = 220 + (i % 2) * 55
        draw.rounded_rectangle((x, y, x + 120, y + 16), radius=9, fill=(255, 255, 255, 80))
    draw.rounded_rectangle((120, 460, 780, 600), radius=28, fill=(0, 0, 0, 60))
    add_text_center(img, title, 54, text_color, y_offset=-90)
    add_text_center(img, subtitle, 26, (235, 234, 255), y_offset=30)
    img.save(path)


def make_profile(path):
    img = make_gradient((900, 900), (18, 28, 42), (44, 87, 106))
    draw = ImageDraw.Draw(img)
    draw.ellipse((240, 150, 660, 430), fill=(244, 192, 132))
    draw.rounded_rectangle((180, 420, 720, 860), radius=80, fill=(246, 166, 106))
    draw.ellipse((270, 170, 620, 350), fill=(27, 35, 41))
    draw.arc((260, 170, 610, 330), start=200, end=360, fill=(245, 220, 185), width=12)
    draw.rounded_rectangle((240, 500, 660, 760), radius=28, fill=(37, 73, 91))
    draw.rounded_rectangle((300, 570, 600, 690), radius=18, fill=(246, 166, 106))
    for cx, cy, rad, color in [(150, 180, 120, (72, 213, 197)), (760, 210, 140, (246, 166, 106)), (700, 700, 120, (78, 113, 155))]:
        draw.ellipse((cx-rad, cy-rad, cx+rad, cy+rad), outline=color, width=5)
    img.save(path)


def make_project_mock(path, title):
    img = make_gradient((900, 640), (13, 22, 33), (27, 60, 81))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((60, 70, 840, 560), radius=28, fill=(10, 17, 25, 120))
    draw.rounded_rectangle((90, 110, 810, 500), radius=18, fill=(20, 38, 56))
    draw.rectangle((120, 160, 760, 185), fill=(246, 166, 106))
    draw.rectangle((120, 210, 550, 250), fill=(83, 213, 197))
    draw.rectangle((120, 270, 680, 310), fill=(158, 203, 255))
    draw.rectangle((120, 340, 420, 380), fill=(246, 166, 106))
    draw.rectangle((120, 410, 610, 450), fill=(83, 213, 197))
    font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 32)
    lines = textwrap.wrap(title, width=20)
    y = 470
    for line in lines[:2]:
        draw.text((120, y), line, fill=(245, 246, 255), font=font)
        y += 40
    img.save(path)


def pdf_to_jpg(pdf_path, jpg_path):
    doc = fitz.open(str(pdf_path))
    if doc.page_count == 0:
        doc.close()
        raise ValueError(f'No pages in {pdf_path}')
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    img = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
    img.save(jpg_path)
    doc.close()

# Create core assets
make_profile(images_dir / 'profile.jpg')
make_profile(images_dir / 'placeholder-profile.jpg')
make_project_mock(images_dir / 'project-education.jpg', 'Education Analysis')
make_project_mock(images_dir / 'project-bus.jpg', 'Bus Delay')
make_project_mock(images_dir / 'project-placeholder.jpg', 'Project')

for label, path in [
    ('Gallery Placeholder', gallery_dir / 'placeholder.jpg'),
    ('Certificate Placeholder', cert_dir / 'placeholder-card.jpg'),
    ('ACM Event', gallery_dir / 'acm-placeholder.jpg'),
    ('Literary Club', gallery_dir / 'literary-placeholder.jpg'),
    ('ICSIT Event', gallery_dir / 'icsit-placeholder.jpg'),
    ('Hackathon', gallery_dir / 'hackathon-placeholder.jpg'),
    ('Sports', gallery_dir / 'sports-placeholder.jpg'),
    ('Campus Life', gallery_dir / 'campus-placeholder.jpg'),
]:
    if not path.exists():
        make_placeholder(path, label.split(' ')[0], 'Portfolio', (12, 21, 31), (29, 80, 104), (246, 166, 106))

# SVG assets
assets.joinpath('favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f6a66a"/><stop offset="1" stop-color="#53d5c5"/></linearGradient></defs><rect width="128" height="128" rx="26" fill="#091822"/><rect x="12" y="12" width="104" height="104" rx="22" fill="url(#g)" opacity="0.2"/><circle cx="64" cy="64" r="40" fill="url(#g)"/><path d="M44 83V45h16l12 16 12-16h16v38h-14V58L73 76 58 58v25Z" fill="#091822"/></svg>''', encoding='utf-8')
images_dir.joinpath('og-image.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08131f"/><stop offset="1" stop-color="#103a46"/></linearGradient><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f6a66a"/><stop offset="1" stop-color="#53d5c5"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="970" cy="180" r="140" fill="#f6a66a" opacity="0.12"/><circle cx="230" cy="470" r="190" fill="#53d5c5" opacity="0.12"/><rect x="110" y="120" width="980" height="390" rx="26" fill="#102233" stroke="#2d4f68"/><text x="150" y="230" font-family="Arial, sans-serif" font-size="44" fill="#53d5c5">SAHITI CHHANAM</text><text x="150" y="315" font-family="Arial, sans-serif" font-size="84" font-weight="700" fill="#edf6ff">Software Engineer</text><text x="150" y="390" font-family="Arial, sans-serif" font-size="62" fill="#f6a66a">in the Making</text><rect x="150" y="430" width="350" height="8" rx="4" fill="url(#g)"/></svg>''', encoding='utf-8')

# Copy originally provided docs into the certificates folder
source_map = [
    (root / 'certificate internship elevate labs.png', cert_dir / 'elevate-labs-internship.png'),
    (root / 'Maincrafts Certificate of Internship-77.pdf', cert_dir / 'maincrafts-internship.pdf'),
    (root / 'python red hat sahiti .pdf', cert_dir / 'python-red-hat-sahiti.pdf'),
    (root / 'red hat administration Sahiti-Chhanam.pdf', cert_dir / 'red-hat-admin-sahiti.pdf'),
    (root / 'springboard infosys dsa certifictae sahiti.pdf', cert_dir / 'springboard-dsa-sahiti.pdf'),
    (root / 'agentic ai udemy sahiti.pdf', cert_dir / 'agentic-ai-udemy-sahiti.pdf'),
]
for src, dst in source_map:
    if src.exists():
        shutil.copy2(src, dst)

# Convert the key PDFs into JPG thumbs for easy display
pdf_to_thumb_targets = [
    (cert_dir / 'python-red-hat-sahiti.pdf', cert_dir / 'red-hat-python.jpg'),
    (cert_dir / 'red-hat-admin-sahiti.pdf', cert_dir / 'red-hat-rh124.jpg'),
    (cert_dir / 'springboard-dsa-sahiti.pdf', cert_dir / 'springboard-dsa.jpg'),
    (cert_dir / 'agentic-ai-udemy-sahiti.pdf', cert_dir / 'agentic-ai-udemy.jpg'),
    (cert_dir / 'maincrafts-internship.pdf', cert_dir / 'maincrafts-internship-thumb.jpg'),
]
for src, dst in pdf_to_thumb_targets:
    if src.exists():
        try:
            pdf_to_jpg(src, dst)
        except Exception:
            make_placeholder(dst, src.stem.replace('-', ' ').title(), 'Certificate', (14, 22, 35), (47, 98, 109), (246, 166, 106))

# Create a stub resume PDF in the required location
resume_path = assets / 'Sahiti_Chhanam_Resume.pdf'
resume_pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 142 >>\nstream\nBT\n/F1 18 Tf\n72 720 Td\n(Sahiti Chhanam Resume placeholder) Tj\n0 -28 Td\n/F1 12 Tf\n(Replace this placeholder with the final resume PDF.) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000123 00000 n \n0000000524 00000 n \n0000001864 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n1953\n%%EOF\n"
resume_path.write_bytes(resume_pdf)

print('Generation complete')
print('Assets created:', sorted(str(p.relative_to(root)) for p in assets.rglob('*') if p.is_file()))
