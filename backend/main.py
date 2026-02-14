from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.database import engine
from models.base import Base
from users.router import router as users_router
from plaid.router import router as plaid_router
from transactions.router import router as transactions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # --- Startup ---
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Connected to database and tables verified.")
    except Exception as e:
        print(f"⚠️  Database connection failed: {e}")
        print("   The server will still start — fix your DATABASE_URL in .env and restart.")
    yield
    # --- Shutdown ---
    engine.dispose()
    print("🛑 Database connections closed.")


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — adjust origins when you deploy the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register routers ---
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(plaid_router, prefix="/api/plaid", tags=["Plaid"])
app.include_router(transactions_router, prefix="/api/transactions", tags=["Transactions"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}