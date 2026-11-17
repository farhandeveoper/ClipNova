# ClipNova
Paste a YouTube link and get ranked vertical short clips. ClipNova uses the bundled AI YouTube Shorts Generator for downloading, long-video transcription, highlight ranking, and clip rendering.

## Install (Windows)

- Node.js 18+
- Python 3.10–3.12 with the Python Launcher (`py`)
- FFmpeg on PATH (`winget install Gyan.FFmpeg`)
- A Gemini or OpenAI API key for highlight ranking

Install the generator dependencies:

```powershell
cd AI-Youtube-Shorts-Generator
py -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt -r requirements-local.txt
Copy-Item .env.example .env
```

Edit `AI-Youtube-Shorts-Generator/.env` if you want LLM highlight ranking: for Gemini set `LLM_PROVIDER=gemini` and `GEMINI_API_KEY=...`; for OpenAI set `LLM_PROVIDER=openai` and `OPENAI_API_KEY=...`. Without a key, local ranking is used. The faster-whisper `tiny` model downloads on the first run for quicker CPU transcription. Set `LOCAL_WHISPER_MODEL=base` or `small` for better accuracy at the cost of speed.

## Run

Terminal 1: `cd backend && npm install && npm start` (`http://localhost:5000`)

Terminal 2: `cd frontend && npm install && npm run dev` (`http://localhost:5173`)

Submit a YouTube video link in ClipNova. Long videos are transcribed, then highlights are ranked by the configured LLM or local transcript cues. Clips fit the full source frame into a 9:16 video with padding instead of cutting off the sides. Completed job files expire after 24 hours.

Use only videos you own or have permission to use.
