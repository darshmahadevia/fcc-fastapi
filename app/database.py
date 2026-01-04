from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .config import settings as s


# postregsql://<username>:<password>@<ip-address/hostname>/<database-name>


SQLALCHEMY_DATABASE_URL = f"postgresql://{s.database_username}:{s.database_password}@{s.database_hostname}:{s.database_port}/{s.database_name}?sslmode=require"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# dependency
def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# change this SQLAclhemy -> SQLModel

# postgress connect
# while True:
#     try:
#         conn = psycopg.connect(
#             host="localhost", dbname="fastapi", user="postgres", password="password"
#         )
#         curr = conn.cursor(row_factory=dict_row)
#         print("Database Connection Succesful")
#         break

#     except Exception as err:
#         print("connection to databse failed")
#         print("error:", err)
#         time.sleep(2)
