from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import websocket_router

app = FastAPI(title="TicTacToe MultiPlayer Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.12:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router.router)

@app.get("/")
def read_root():
    return {"message": "Servidor do Jogo da Velha (FastAPI) está operacional."}
