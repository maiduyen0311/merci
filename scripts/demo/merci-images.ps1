# Build demos/merci/images/ from the Merci source photos (../instagram, ../banner).
#   powershell -ExecutionPolicy Bypass -File scripts/demo/merci-images.ps1
# Instagram tiles: centre-cropped squares 1080px. Lookbook looks: max width 1200px (portrait kept).
# Licence of these photos is unknown (design/IMAGE-CREDITS.md) — demo store only, never in the sale zip.
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$src = Join-Path (Split-Path -Parent $root) ''
$out = Join-Path $root 'demos\merci\images'
New-Item -ItemType Directory -Force $out | Out-Null

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 84L

function Save-Resized($inPath, $outPath, $maxW, $square) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  try {
    $sx = 0; $sy = 0; $sw = $img.Width; $sh = $img.Height
    if ($square) {
      $side = [Math]::Min($sw, $sh)
      $sx = [int](($sw - $side) / 2); $sy = [int](($sh - $side) / 2); $sw = $side; $sh = $side
    }
    $w = [Math]::Min($maxW, $sw)
    $h = [int]([Math]::Round($sh * $w / $sw))
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $sx, $sy, $sw, $sh, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($outPath, $jpeg, $params)
    $g.Dispose(); $bmp.Dispose()
    Write-Output ("{0} {1}x{2}" -f (Split-Path -Leaf $outPath), $w, $h)
  } finally { $img.Dispose() }
}

# key = output name, value = source (relative to the Merci folder)
$instagram = [ordered]@{
  'instagram-1' = 'instagram\1.jpg'
  'instagram-2' = 'instagram\3.jpg'
  'instagram-3' = 'instagram\5.jpg'
  'instagram-4' = 'instagram\7.jpg'
  'instagram-5' = 'instagram\8.jpg'
  'instagram-6' = 'instagram\9.jpg'
}
$looks = [ordered]@{
  'lookbook-1' = 'banner\15.jpg'
  'lookbook-2' = 'banner\7.jpg'
  'lookbook-3' = 'banner\9.jpg'
  # layered banners (snippets/mc-art.liquid) — portrait photos on light backgrounds
  'art-knit' = 'banner\1.jpg'
  'art-pink' = 'banner\2.jpg'
  'art-shirt' = 'banner\4.jpg'
  'art-green' = 'banner\6a.jpg'
  'art-scarf' = 'banner\10.jpg'
  'art-cardigan' = 'banner\11.jpg'
}
foreach ($k in $instagram.Keys) { Save-Resized (Join-Path $src $instagram[$k]) (Join-Path $out "$k.jpg") 1080 $true }
foreach ($k in $looks.Keys) { Save-Resized (Join-Path $src $looks[$k]) (Join-Path $out "$k.jpg") 1200 $false }

# Product packshots for the demo catalogue (scripts/demo/merci-catalogue.js) — products only,
# no model photos (user 2026-11-17). PNG cut-outs are flattened onto white.
function Save-Packshot($inPath, $outPath, $maxW) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  try {
    $w = [Math]::Min($maxW, $img.Width)
    $h = [int]([Math]::Round($img.Height * $w / $img.Width))
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $bmp.Save($outPath, $jpeg, $params)
    $g.Dispose(); $bmp.Dispose()
    Write-Output ("{0} {1}x{2}" -f (Split-Path -Leaf $outPath), $w, $h)
  } finally { $img.Dispose() }
}
$packshots = [ordered]@{
  'p-headband' = 'product\png\22.png'
  'p-bucket-patch' = 'product\png\20.png'
  'p-bucket-cobalt' = 'product\png\18.png'
  'p-scrunchie' = 'product\27b.jpg'
  'p-sneaker-pink' = 'product\31.jpg'
  'p-cardigan-pink' = 'product\32a.jpg'
  'p-backpack' = 'product\11a.jpg'
}
foreach ($k in $packshots.Keys) { Save-Packshot (Join-Path $src $packshots[$k]) (Join-Path $out "$k.jpg") 1000 }

# Cut-outs for the homepage layered tiles — kept as PNG so they stand on the panel colour
function Save-Cutout($inPath, $outPath, $maxW) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  try {
    $w = [Math]::Min($maxW, $img.Width)
    $h = [int]([Math]::Round($img.Height * $w / $img.Width))
    $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output ("{0} {1}x{2}" -f (Split-Path -Leaf $outPath), $w, $h)
  } finally { $img.Dispose() }
}
# Staged packshots for the layered banners (mc-art) — products only, no model (user 2026-11-17).
# The cut-out is trimmed to its alpha box and centred on a soft tinted backdrop with a floor
# shadow, so the JPG works in any mc-art frame (arch / circle / rectangle, object-fit: cover).
function Save-Stage($inPath, $outPath, $hex, $scale) {
  $img = New-Object System.Drawing.Bitmap $inPath
  try {
    $x0 = $img.Width; $y0 = $img.Height; $x1 = 0; $y1 = 0
    for ($y = 0; $y -lt $img.Height; $y += 3) { for ($x = 0; $x -lt $img.Width; $x += 3) {
      if ($img.GetPixel($x, $y).A -gt 24) { if ($x -lt $x0) { $x0 = $x }; if ($x -gt $x1) { $x1 = $x }; if ($y -lt $y0) { $y0 = $y }; if ($y -gt $y1) { $y1 = $y } }
    } }
    $bw = $x1 - $x0 + 1; $bh = $y1 - $y0 + 1
    $W = 960; $H = 1200
    $bmp = New-Object System.Drawing.Bitmap $W, $H
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $tint = [System.Drawing.ColorTranslator]::FromHtml($hex)
    $light = [System.Drawing.Color]::FromArgb(255, [int](($tint.R + 255 * 2) / 3), [int](($tint.G + 255 * 2) / 3), [int](($tint.B + 255 * 2) / 3))
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush ([System.Drawing.Point]::new(0, 0)), ([System.Drawing.Point]::new(0, $H)), $light, $tint
    $g.FillRectangle($bg, 0, 0, $W, $H)
    # fit the product in a box ($scale of the canvas), centred a little above the middle
    $k = [Math]::Min($W * $scale / $bw, $H * $scale / $bh)
    $dw = [int]($bw * $k); $dh = [int]($bh * $k)
    $dx = [int](($W - $dw) / 2); $dy = [int](($H - $dh) / 2 - $H * 0.03)
    $shadowW = [int]($dw * 0.8)
    $sh = New-Object System.Drawing.Drawing2D.GraphicsPath
    $sh.AddEllipse([int](($W - $shadowW) / 2), $dy + $dh - 22, $shadowW, 50)
    $pb = New-Object System.Drawing.Drawing2D.PathGradientBrush $sh
    $pb.CenterColor = [System.Drawing.Color]::FromArgb(70, 60, 40, 35)
    $pb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 60, 40, 35))
    $g.FillPath($pb, $sh)
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle $dx, $dy, $dw, $dh), $x0, $y0, $bw, $bh, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($outPath, $jpeg, $params)
    $g.Dispose(); $bmp.Dispose()
    Write-Output ("{0} 960x1200" -f (Split-Path -Leaf $outPath))
  } finally { $img.Dispose() }
}
$stages = [ordered]@{
  'stage-jacket' = @('product\png\10.png', '#f2dcd8', 0.6)
  'stage-straw' = @('product\png\18.png', '#f4e3d3', 0.56)
  'stage-hat' = @('product\png\25.png', '#efe1d6', 0.58)
  'stage-shirt' = @('product\png\9.png', '#dfece4', 0.6)
  'stage-tote' = @('product\png\19.png', '#f6dede', 0.6)
  'stage-tee' = @('product\png\5a.png', '#f3e2da', 0.6)
}
foreach ($k in $stages.Keys) { $v = $stages[$k]; Save-Stage (Join-Path $src $v[0]) (Join-Path $out "$k.jpg") $v[1] $v[2] }

Save-Cutout (Join-Path $src 'product\png\8.png') (Join-Path $out 'tile-dress.png') 900
Save-Cutout (Join-Path $src 'product\png\19.png') (Join-Path $out 'tile-beach.png') 900
Save-Cutout (Join-Path $src 'product\png\1.png') (Join-Path $out 'tile-shirt.png') 900
