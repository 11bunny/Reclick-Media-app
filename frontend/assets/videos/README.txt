Put your own step-by-step demo clips here, then update the <source src="..."> and
poster="..." attributes in index.html's "How it works" section to point at these files
instead of the placeholder video/images currently used.

Suggested file names (matching the 4 steps):
  step1-tell-us.mp4        step1-poster.jpg
  step2-match.mp4          step2-poster.jpg
  step3-shoot.mp4          step3-poster.jpg
  step4-delivery.mp4       step4-poster.jpg

Tips for these clips:
- Keep each under ~60 seconds and under ~15-20MB if possible — large files slow the page down.
  Compress with HandBrake or ffmpeg, e.g.:
    ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset veryfast -vf scale=720:-2 output.mp4
- Shoot vertically (9:16) since the section is styled like a phone/reel frame.
- A poster image (a still frame) is shown before the person presses play — export one
  frame from each clip as a .jpg for that.
