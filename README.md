# Da Vinci: Voice-Activated Educational Assistant

Da Vinci is an advanced, voice-activated educational assistant powered by FastAPI on the backend and React (Vite + TailwindCSS) on the frontend. It features rich visual aesthetics, real-time voice-to-text transcription, text-to-speech audio playback, dynamic workspaces, multi-project chat management, and conversation branching.

---

## Key Features
*   🎙️ **Voice Interactions**: Speech-to-text recording, transcript editing, and text-to-speech voice generation.
*   📂 **Workspace & Multi-Project Chats**: Organise your chat dialogues into custom workspace projects. Rename, delete, and manage conversations localized inside specific workspaces.
*   🔄 **Dialogue Branching**: Edit any previously sent message prompts to generate response splits. Switch between sibling branches seamlessly using `< 1 / 2 >` paginators.
*   🎭 **Dynamic Welcome Prompts**: Receive a unique philosophical greeting every time you start a new conversation.
*   📈 **RAG & Context Awareness**: Upload documents (PDF, Word, TXT) to build local context indexes for accurate educational search and answering.

---

## Repository Structure
```text
S/
├── backend/              # FastAPI Python backend server
│   ├── database.py       # SQLite database configuration & dialogue tree queries
│   ├── main.py           # Application routing endpoints & middle-tier server
│   ├── requirements.txt  # Python pip dependencies
│   ├── services/         # LLM, Transcription, RAG indexing services
│   └── static/           # Ephemeral generated audio clips and assets
├── frontend/             # React Vite client interface
│   ├── src/              # App.jsx, components (Sidebar, ChatWindow, etc.)
│   ├── vercel.json       # Reverse proxy configuration for production
│   └── package.json      # Frontend package configuration
└── .gitignore            # Excludes node_modules, virtual envs, and secrets
```

---

## 💻 Local Setup Instructions

### Prerequisites
*   **Python**: Version 3.10 or 3.11 recommended.
*   **Node.js**: Version 18+ recommended.

---

### 1. Backend Configuration & Startup

1.  Navigate into the `backend/` folder:
    ```bash
    cd backend
    ```
2.  Create a Virtual Environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the Virtual Environment:
    *   **Windows (PowerShell)**:
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   **Mac/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install Dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Set up Environment Variables:
    Create a `.env` file inside the `backend/` directory:
    ```env
    PORT=5000
    HF_TOKEN=your_hugging_face_read_token_here
    HF_MODEL=HuggingFaceH4/zephyr-7b-beta
    SQLITE_DB_PATH=./data/history.db
    ```
6.  Start the FastAPI Server:
    ```bash
    uvicorn main:app --reload --port 5000
    ```
    The backend will run locally at: `http://127.0.0.1:5000`

---

### 2. Frontend Configuration & Startup

1.  Open a new terminal window and navigate into the `frontend/` folder:
    ```bash
    cd frontend
    ```
2.  Install Packages:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The client interface will run locally at: `http://localhost:3000` (or the port displayed in your terminal).

---

## 🚀 Production Deployment Instructions

For production setups, we recommend the decoupled approach:

### 1. Backend (Render)
1. Push your repository to GitHub.
2. Log into [Render](https://render.com) and create a new **Web Service**.
3. Point to the repository.
4. Set **Root Directory** to `backend`.
5. Set **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 10000
   ```
6. Under **Environment Variables**, set:
   *   `PYTHON_VERSION` = `3.11.0`
   *   `HF_TOKEN` = `your_secret_huggingface_token`
   *   `SQLITE_DB_PATH` = `./data/history.db`

### 2. Frontend (Vercel)
1. Open [frontend/vercel.json](frontend/vercel.json) and change the destination endpoint:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-render-backend-url.onrender.com/api/:path*"
       },
       {
         "source": "/static/:path*",
         "destination": "https://your-render-backend-url.onrender.com/static/:path*"
       }
     ]
   }
   ```
2. Deploy to [Vercel](https://vercel.com) using the `frontend` folder as the project's root directory. The build preset will automatically resolve to **Vite**.
