import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cozy Code Corner Backend"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("PORT", 8000))
    JUDGE0_API_URL: str = os.getenv("JUDGE0_API_URL", "")
    JUDGE0_API_KEY: str = os.getenv("JUDGE0_API_KEY", "")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
