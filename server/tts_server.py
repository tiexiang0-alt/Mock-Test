#!/usr/bin/env python3
"""
Edge TTS Server for TOEFL Listening Prep AI
Provides high-quality text-to-speech using Microsoft Edge's neural voices.
Updated for more authentic American accents and prosody control.
"""

import asyncio
import edge_tts
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os
import hashlib
import threading

# Configuration
PORT = 3001
AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), "audio_cache")

# Voice mapping optimized for "Authentic American TOEFL" context
# Using the most natural sounding Neural voices available in Edge
VOICE_MAP = {
    # Students / Casual
    "female": "en-US-JennyNeural",      # Natural, conversational female
    "male": "en-US-GuyNeural",          # Natural, conversational male
    "student_female": "en-US-AnaNeural",    # Slightly younger/softer female
    "student_male": "en-US-EricNeural",     # Typical distinct male student voice

    # Academic / Formal
    "lecturer": "en-US-AndrewNeural",   # Deep, warm, very "documentary/professor" like
    "professor": "en-US-ChristopherNeural", # Formal, structured, clear articulation
    "professor_female": "en-US-AvaNeural",  # Professional, articulate female professor
    
    # Utilities
    "duo": "en-US-AriaNeural",          # Very versatile, clear standard American
    "narrator": "en-US-BrianNeural",    # Classic narrator style
}

# Prosody presets (Rate and Pitch) to enhance naturalness
# Format: separate rate and pitch strings for edge_tts
PROSODY_MAP = {
    "default":          {"rate": "-5%", "pitch": "+0Hz"},  # Slightly slower for clarity
    "student_rapid":    {"rate": "+5%", "pitch": "+0Hz"},  # Excited/Younger
    "lecture_slow":     {"rate": "-10%", "pitch": "-2Hz"}, # Serious/Academic (Deep & Measured)
    "conversation":     {"rate": "+0%", "pitch": "+0Hz"},  # Normal flow
}

# Ensure cache directory exists
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)


def get_cache_key(text: str, voice: str, rate: str, pitch: str) -> str:
    """Generate a unique cache key based on text, voice, and prosody."""
    content = f"{voice}:{rate}:{pitch}:{text}"
    return hashlib.md5(content.encode()).hexdigest()


async def generate_audio(text: str, voice: str, rate: str = "+0%", pitch: str = "+0Hz") -> bytes:
    """Generate audio using Edge TTS with prosody adjustments."""
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    return audio_data


class TTSHandler(BaseHTTPRequestHandler):
    """HTTP handler for TTS requests."""
    
    def log_message(self, format, *args):
        """Suppress default logging for cleaner output."""
        pass
    
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests for TTS."""
        try:
            parsed = urllib.parse.urlparse(self.path)
            
            if parsed.path == "/tts":
                params = urllib.parse.parse_qs(parsed.query)
                text = params.get("text", [""])[0]
                speaker_type = params.get("speaker", ["female"])[0]
                
                if not text:
                    self.send_error(400, "Missing 'text' parameter")
                    return
                
                # Determine Voice
                voice = VOICE_MAP.get(speaker_type, VOICE_MAP["female"])
                
                # Determine Prosody based on speaker type
                prosody = PROSODY_MAP["default"]
                if speaker_type in ["lecturer", "professor"]:
                    prosody = PROSODY_MAP["lecture_slow"]
                elif speaker_type in ["student_male", "student_female"]:
                    prosody = PROSODY_MAP["conversation"]
                
                rate = prosody["rate"]
                pitch = prosody["pitch"]

                # Generate
                cache_key = get_cache_key(text, voice, rate, pitch)
                cache_file = os.path.join(AUDIO_CACHE_DIR, f"{cache_key}.mp3")
                
                if os.path.exists(cache_file):
                    with open(cache_file, "rb") as f:
                        audio_data = f.read()
                    print(f"✓ Served cached: [{speaker_type}] {voice} (Rate:{rate})")
                else:
                    print(f"⟳ Generating: [{speaker_type}] {voice} (Rate:{rate})...")
                    audio_data = asyncio.run(generate_audio(text, voice, rate, pitch))
                    
                    with open(cache_file, "wb") as f:
                        f.write(audio_data)
                    print(f"✓ Created new audio")
                
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "audio/mpeg")
                self.send_header("Content-Length", str(len(audio_data)))
                self.end_headers()
                self.wfile.write(audio_data)
                
            elif parsed.path == "/voices":
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(VOICE_MAP).encode())
                
            elif parsed.path == "/health":
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "service": "edge-tts-enhanced"}).encode())
                
            else:
                self.send_error(404, "Endpoint not found")
                
        except Exception as e:
            print(f"✗ Error: {e}")
            self.send_error(500, str(e))
    
    def do_POST(self):
        """Handle POST requests for TTS."""
        try:
            parsed = urllib.parse.urlparse(self.path)
            
            if parsed.path == "/tts":
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                data = json.loads(body)
                
                text = data.get("text", "")
                speaker_type = data.get("speaker", "female")
                
                if not text:
                    self.send_error(400, "Missing 'text'")
                    return
                
                # Determine Voice & Prosody
                voice = VOICE_MAP.get(speaker_type, VOICE_MAP["female"])
                
                # Dynamic prosody assignment
                prosody = PROSODY_MAP["default"]
                if speaker_type in ["lecturer", "professor"]:
                    prosody = PROSODY_MAP["lecture_slow"]
                elif speaker_type in ["student_male", "student_female"]:
                    prosody = PROSODY_MAP["conversation"]
                
                rate = prosody["rate"]
                pitch = prosody["pitch"]

                # Generate
                cache_key = get_cache_key(text, voice, rate, pitch)
                cache_file = os.path.join(AUDIO_CACHE_DIR, f"{cache_key}.mp3")
                
                if os.path.exists(cache_file):
                    with open(cache_file, "rb") as f:
                        audio_data = f.read()
                    print(f"✓ Served cached (POST): [{speaker_type}] {voice}")
                else:
                    print(f"⟳ Generating (POST): [{speaker_type}] {voice}...")
                    audio_data = asyncio.run(generate_audio(text, voice, rate, pitch))
                    with open(cache_file, "wb") as f:
                        f.write(audio_data)
                    print(f"✓ Created new audio")
                
                self.send_response(200)
                self.send_cors_headers()
                self.send_header("Content-Type", "audio/mpeg")
                self.send_header("Content-Length", str(len(audio_data)))
                self.end_headers()
                self.wfile.write(audio_data)
                
            else:
                self.send_error(404, "Endpoint not found")
                
        except Exception as e:
            print(f"✗ Error: {e}")
            self.send_error(500, str(e))


def run_server():
    server = HTTPServer(("0.0.0.0", PORT), TTSHandler)
    print(f"""
╔═══════════════════════════════════════════════════════╗
║   🇺🇸  Authentic American Accent TTS Server (Edge)    ║
╠═══════════════════════════════════════════════════════╣
║   Server running at: http://localhost:{PORT}           ║
║   Status: ENHANCED VOICES & PROSODY ACTIVE            ║
╚═══════════════════════════════════════════════════════╝
    """)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    run_server()
