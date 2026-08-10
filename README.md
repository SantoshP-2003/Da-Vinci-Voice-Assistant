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

