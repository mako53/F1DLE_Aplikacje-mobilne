from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import cx_Oracle
import random
from fastapi import FastAPI, Query
from typing import List
import logging
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# FastAPI app initialization
app = FastAPI()

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Oracle Database connection
def get_db_connection():
    dsn = cx_Oracle.makedsn("192.168.0.15", 1521, service_name="XEPDB1")
    conn = cx_Oracle.connect(user="f1dle_user", password="1234", dsn=dsn)
    return conn

# @app.get("/api/admin/drivers")
# async def get_drivers(query: str = Query("", min_length=1, max_length=50)) -> List[dict]:
#     """
#     Endpoint pobierający kierowców z bazy danych Oracle.
#     """
#     try:
#         # Połączenie z bazą danych
#         conn = get_db_connection()
#         cursor = conn.cursor()
#
#         # Zapytanie SQL z filtrem
#         sql_query = """
#             SELECT driver_id, name, surname
#             FROM DRIVERS
#             WHERE LOWER(name) LIKE :search_query
#             ORDER BY name
#         """
#         search_query = f"%{query.lower()}%"
#         cursor.execute(sql_query, {"search_query": search_query})
#
#         # Pobieranie wyników
#         rows = cursor.fetchall()
#         drivers = [{"driver_id": row[0], "name": row[1], "surname": row[2]} for row in rows]
#
#         return drivers
#
#     except cx_Oracle.DatabaseError as e:
#         error, = e.args
#         raise HTTPException(status_code=500, detail=f"Database error: {error.message}")
#     finally:
#         # Zamknięcie połączenia
#         if 'cursor' in locals():
#             cursor.close()
#         if 'conn' in locals():
#             conn.close()

@app.get("/api/admin/drivers")
async def get_drivers(query: str = Query("", min_length=1, max_length=50)) -> List[dict]:
    """
    Endpoint pobierający kierowców z tabeli DRIVERS w bazie danych Oracle.
    """
    try:
        # Połączenie z bazą danych
        conn = get_db_connection()
        cursor = conn.cursor()

        # Zapytanie SQL z filtrem
        sql_query = """
            SELECT 
                DRIVER_ID, 
                NAME, 
                SURNAME, 
                AGE, 
                TEAMS_TEAM_ID, 
                STARTING_NUM, 
                WC, 
                STARTS, 
                POINTS, 
                PODIUMS, 
                DEBUT, 
                CIRCUITS_CIRCUIT_ID, 
                NATIONS_NATION_ID
            FROM DRIVERS
            WHERE LOWER(NAME) LIKE :search_query OR LOWER(SURNAME) LIKE :search_query
            ORDER BY NAME, SURNAME
        """
        search_query = f"%{query.lower()}%"
        cursor.execute(sql_query, {"search_query": search_query})

        # Pobieranie wyników
        rows = cursor.fetchall()
        drivers = [
            {
                "driver_id": row[0],
                "name": row[1],
                "surname": row[2],
                "age": row[3],
                "team_id": row[4],
                "starting_num": row[5],
                "wc": row[6],
                "starts": row[7],
                "points": row[8],
                "podiums": row[9],
                "debut": row[10],
                "circuit_id": row[11],
                "nation_id": row[12]
            }
            for row in rows
        ]

        return drivers

    except cx_Oracle.DatabaseError as e:
        error, = e.args
        raise HTTPException(status_code=500, detail=f"Database error: {error.message}")
    finally:
        # Zamknięcie połączenia
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()




# Models
class GuessRequest(BaseModel):
    guess: str

class LoginRequest(BaseModel):
    username: str
    password: str

current_game = None

# Routes
@app.get("/api/test/drivers")
def test_drivers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drivers")
    columns = [col[0] for col in cursor.description]
    drivers = [dict(zip(columns, row)) for row in cursor.fetchall()]
    conn.close()
    return {"drivers": drivers}

@app.get("/", response_class=HTMLResponse)
def serve_frontend(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/admin/login")
def login(request: LoginRequest):
    if request.username == "admin" and request.password == "password":
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Incorrect login information")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/game/start")
def start_game():
    global current_game
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drivers")
    columns = [col[0] for col in cursor.description]
    drivers = [dict(zip(columns, row)) for row in cursor.fetchall()]
    conn.close()

    if not drivers:
        raise HTTPException(status_code=400, detail="No drivers available to start the game.")


    # Losowanie gracza
    target_driver = random.choice(drivers)


    # Tworzenie gry
    current_game = {
        "game_id": str(random.randint(10000, 99999)),
        "target_driver": target_driver,
        "guesses_left": 5,
    }
    logger.info(f"Game started: game_id={current_game['game_id']} with target driver {target_driver['NAME']} {target_driver['SURNAME']}")

    return {"game_id": current_game["game_id"], "message": "Game started successfully"}

# @app.post("/api/game/guess")
# def guess_driver(guess_request: GuessRequest):
#     print(f"Received guess: {guess_request.guess}")  # Logowanie przychodzącego zgadnięcia
#     global current_game
#     if not current_game:
#         raise HTTPException(status_code=400, detail="No game in progress.")
#
#     target_driver = current_game["target_driver"]
#     guess_name = guess_request.guess.strip().lower()
#     hints = {}
#
#     # Generate hints
#     hints["name"] = {
#         "status": "correct" if guess_name == target_driver["NAME"].lower() else "incorrect",
#         "color": "green" if guess_name == target_driver["NAME"].lower() else "red",
#     }
#
#     # Check if guess is correct
#     if guess_request.guess.lower() == target_driver["NAME"].lower():
#         current_game = None
#         return {"correct": True, "hints": hints}
#
#     # Reduce guesses
#     current_game["guesses_left"] -= 1
#     if current_game["guesses_left"] <= 0:
#         correct_answer = target_driver["NAME"]
#         current_game = None
#         return {"correct": False, "correct_answer": correct_answer}
#
#     return {"correct": False, "hints": hints}
@app.get("/api/game/target-driver")
def get_target_driver():
    if not current_game or not current_game.get("target_driver"):
        raise HTTPException(status_code=400, detail="No game in progress or no target driver selected.")

    target_driver = current_game["target_driver"]
    return {
        "name": target_driver["NAME"],
        "surname": target_driver["SURNAME"],
        "age": target_driver["AGE"],
        "team_id": target_driver["TEAMS_TEAM_ID"],
        "starting_num": target_driver["STARTING_NUM"],
        "wc": target_driver["WC"],
        "starts": target_driver["STARTS"],
        "points": target_driver["POINTS"],
        "podiums": target_driver["PODIUMS"],
        "debut": target_driver["DEBUT"],
        "circuit_id": target_driver["CIRCUITS_CIRCUIT_ID"],
        "nation_id": target_driver["NATIONS_NATION_ID"]
    }
@app.post("/api/game/guess")
def guess_driver(guess_request: GuessRequest):
    print(f"Received guess: {guess_request.guess}")  # Logowanie przychodzącego zgadnięcia
    global current_game
    if not current_game:
        raise HTTPException(status_code=400, detail="No game in progress.")

    target_driver = current_game["target_driver"]
    guess_name = guess_request.guess.strip().lower()



    hints = {}

    # Generowanie podpowiedzi
    hints["name"] = {
        "status": "correct" if guess_name == target_driver["NAME"].lower() else "incorrect",
        "color": "green" if guess_name == target_driver["NAME"].lower() else "red",
    }

    # Sprawdzanie, czy zgadnięcie jest poprawne
    if guess_name == target_driver["NAME"].lower():
        current_game = None
        return {"correct": True, "hints": hints}

    # Zmniejszanie liczby prób
    current_game["guesses_left"] -= 1
    if current_game["guesses_left"] <= 0:
        correct_answer = target_driver["NAME"]
        current_game = None
        return {"correct": False, "correct_answer": correct_answer}

    return {"correct": False, "hints": hints}
@app.get("/api/game/status")
def game_status():
    if not current_game:
        return {"game_id": None, "game_status": "No game in progress", "guesses_left": 0}
    return {
        "game_id": current_game["game_id"],
        "game_status": "in progress",
        "guesses_left": current_game["guesses_left"],
    }

# @app.get("/api/game/suggestions")
# def get_suggestions(prefix: str):
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     query = "SELECT NAME, surname FROM drivers WHERE LOWER(NAME) or LOWER(surname)LIKE :prefix ORDER BY NAME, SURNAME"
#
#     cursor.execute(query, {"prefix": f"{prefix.lower()}%"})
#     suggestions = [row[0] for row in cursor.fetchall()]
#     conn.close()
#     return {"suggestions": suggestions}
@app.get("/api/game/suggestions")
def get_suggestions(prefix: str):
    """
    Endpoint zwracający sugestie imion i nazwisk kierowców na podstawie prefiksu.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Zapytanie SQL z konkatenacją imienia i nazwiska
        query = """
            SELECT NAME || '' || SURNAME AS FULL_NAME
            FROM DRIVERS
            WHERE LOWER(NAME) LIKE :prefix OR LOWER(SURNAME) LIKE :prefix
            ORDER BY NAME, SURNAME;
        """

        cursor.execute(query, {"prefix": f"{prefix.lower()}%"})

        # Pobieranie wyników
        suggestions = [row[0] for row in cursor.fetchall()]
        return {"suggestions": suggestions}

    except cx_Oracle.DatabaseError as e:
        error, = e.args
        raise HTTPException(status_code=500, detail=f"Database error: {error.message}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)