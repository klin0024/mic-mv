#!/usr/bin/env bash
# Analyse a source video for a Remotion remake.
#
# Usage: analyze_video.sh <video> <outdir> [sub_top_ratio] [sub_height_ratio]
#   sub_top_ratio    where the subtitle band starts, as a fraction of height (default 0.83)
#   sub_height_ratio height of the subtitle band, as a fraction of height  (default 0.15)
#
# Produces in <outdir>:
#   info.txt          duration / resolution / fps / streams
#   contact.jpg       1 thumbnail every 4 s, 6 per row  → thumbnail i ≈ second 4*i+2
#   subs_01.jpg …     subtitle band, 1 row per second, 25 rows per sheet
#                     → sheet k, row r (0-based) = second (k-1)*25 + r
#   music.m4a         the audio track (stream copy) — ready for public/
#   cuts.txt          hard scene cuts (seconds), may be empty for crossfades
#
# Notes (Windows ffmpeg builds): glob input patterns and drawtext are avoided on purpose —
# glob is unsupported and drawtext can crash without fontconfig.
set -euo pipefail

VIDEO="$1"
OUT="$2"
TOP="${3:-0.83}"
HR="${4:-0.15}"
mkdir -p "$OUT"

ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$VIDEO" | tee "$OUT/info.txt"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$VIDEO")
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$VIDEO")

# contact sheet: enough rows to cover the whole video
N=$(awk -v d="$DUR" 'BEGIN{print int(d/4)+1}')
ROWS=$(( (N + 5) / 6 ))
ffmpeg -v error -i "$VIDEO" -vf "fps=1/4,scale=320:-1,tile=6x${ROWS}" -frames:v 1 "$OUT/contact.jpg" -y

# subtitle strips, one row per second
Y=$(awk -v h="$H" -v r="$TOP" 'BEGIN{print int(h*r)}')
BH=$(awk -v h="$H" -v r="$HR" 'BEGIN{print int(h*r)}')
SH=$(awk -v w="$W" -v bh="$BH" 'BEGIN{v=int(bh*800/w); if (v%2) v++; print v}')
ffmpeg -v error -i "$VIDEO" -vf "fps=1,crop=${W}:${BH}:0:${Y},scale=800:${SH},tile=1x25" "$OUT/subs_%02d.jpg" -y

# audio track
ffmpeg -v error -i "$VIDEO" -vn -c:a copy "$OUT/music.m4a" -y || echo "no audio stream copied"

# hard cuts
ffmpeg -i "$VIDEO" -vf "select='gt(scene,0.3)',metadata=print" -an -f null - 2>&1 \
  | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$OUT/cuts.txt" || true

echo "duration=${DUR}s size=${W}x${H} thumbnails=${N} subtitle_sheets=$(ls "$OUT"/subs_*.jpg | wc -l) cuts=$(wc -l < "$OUT/cuts.txt")"
