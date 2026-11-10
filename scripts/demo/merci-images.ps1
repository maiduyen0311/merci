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
}
foreach ($k in $instagram.Keys) { Save-Resized (Join-Path $src $instagram[$k]) (Join-Path $out "$k.jpg") 1080 $true }
foreach ($k in $looks.Keys) { Save-Resized (Join-Path $src $looks[$k]) (Join-Path $out "$k.jpg") 1200 $false }
