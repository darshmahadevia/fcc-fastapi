from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from . import schemas, models, database
from sqlalchemy.orm import Session
from .config import settings as s


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


SECRET_KEY = s.secret_key
ALGORITHM = s.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = s.access_token_expire_minutes


def create_access_token(data: dict):  # data = payload that you want to send with token
    to_encode: dict = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credentials_exception):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        id: str = payload.get("user_id")

        if id is None:
            print("id not found")
            raise credentials_exception

        token_data = schemas.TokenData(id=id)

    except JWTError:
        print("JWT error")
        raise credentials_exception

    return token_data


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data =  verify_access_token(token, credentials_exception)

    user = db.query(models.User).filter(models.User.id == token_data.id).first()

    return user

    # return verify_access_token(token, credentials_exception)
