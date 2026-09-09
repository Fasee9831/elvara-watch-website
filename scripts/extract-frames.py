#!/usr/bin/env python3
"""
ELVARA - Automated Video-to-Frame Sequence Extraction Script
Extracts optimized high-resolution WebP & JPG frame sequences from the 3 source MP4 video files.

Usage:
  python scripts/extract-frames.py
  npm run extract-frames
"""

import os
import sys
import glob
import cv2
import numpy as np

# Configuration
NUM_FRAMES = 180  # 180 dense, smooth frames per 10s video sequence
WEBP_QUALITY = 90 # High visual fidelity with lightweight memory footprint
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'frames')

VIDEO_MAP = [
    {
        'id': 'aurelia-1',
        'name': 'AURELIA 1 (Opening Hero Film)',
        'possible_paths': [
            'videos/AURELIA 1.mp4',
            'public/videos/aurelia-1.mp4',
            'videos/aurelia-1.mp4',
        ],
        'out_folder': 'aurelia-1',
    },
    {
        'id': 'aurelia-2',
        'name': 'AURELIA 2 (Movement & Engineering)',
        'possible_paths': [
            'videos/AURELIA 2.mp4',
            'public/videos/aurelia-2.mp4',
            'videos/aurelia-2.mp4',
        ],
        'out_folder': 'aurelia-2',
    },
    {
        'id': 'nocturne',
        'name': 'NOCTURNE (Obsidian Climax)',
        'possible_paths': [
            'videos/NOCTURNE.mp4',
            'public/videos/nocturne.mp4',
            'videos/nocturne.mp4',
        ],
        'out_folder': 'nocturne',
    },
]

def find_video_path(possible_paths):
    for path in possible_paths:
        if os.path.exists(path):
            return path
    return None

def extract_frames():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)
    print(f"[*] Starting ELVARA Frame Extraction -> Destination: {OUTPUT_DIR}")

    for item in VIDEO_MAP:
        video_path = find_video_path(item['possible_paths'])
        if not video_path:
            print(f"[!] Error: Could not find video for {item['name']}")
            continue

        out_path = os.path.join(OUTPUT_DIR, item['out_folder'])
        os.makedirs(out_path, exist_ok=True)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"[!] Error: Cannot open video {video_path}")
            continue

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        print(f"\n[>] Extracting {NUM_FRAMES} frames from '{item['name']}' ({video_path})")
        print(f"    Source specs: {w}x{h}, {fps:.1f} FPS, {total_frames} frames ({total_frames/fps:.1f}s)")

        frame_indices = np.linspace(0, total_frames - 1, NUM_FRAMES, dtype=int)
        extracted = 0

        for i, f_idx in enumerate(frame_indices):
            cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
            ret, frame = cap.read()
            if ret:
                # Save both WebP and JPG for universal fallback
                webp_filename = f"frame_{i+1:03d}.webp"
                jpg_filename = f"frame_{i+1:03d}.jpg"

                cv2.imwrite(os.path.join(out_path, webp_filename), frame, [int(cv2.IMWRITE_WEBP_QUALITY), WEBP_QUALITY])
                cv2.imwrite(os.path.join(out_path, jpg_filename), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
                extracted += 1
            else:
                print(f"    [!] Warning: failed to read frame {f_idx}")

        cap.release()
        print(f"    [+] Saved {extracted} frames to public/frames/{item['out_folder']}/")

    print("\n[OK] Frame extraction complete for all 3 cinematic watch scenes!")

if __name__ == '__main__':
    extract_frames()
