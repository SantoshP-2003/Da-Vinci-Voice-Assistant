from pydantic import BaseModel

class ChatTextRequest(BaseModel):
    sessionId: str
    queryText: str
    languageCode: str = "en"
    voiceEnabled: bool = True
    parentId: int = None

class SessionCreateRequest(BaseModel):
    sessionId: str
    title: str = "New Chat"
    projectId: str = "default"

class SessionRenameRequest(BaseModel):
    title: str

class ProjectCreateRequest(BaseModel):
    projectId: str
    name: str

class ProjectRenameRequest(BaseModel):
    name: str
