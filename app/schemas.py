from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserRes(BaseModel):
    email: EmailStr
    id: int
    created_at: datetime

    # Pydantic v2: allow reading data from ORM objects (SQLAlchemy models)
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# post schemas
class PostBase(BaseModel):

    title: str
    content: str
    published: bool = True


class PostCreate(PostBase):
    pass


class PostRes(PostBase):
    id: int
    created_at: datetime
    owner_id: int
    owner: UserRes

    # Pydantic v2: allow reading data from ORM objects (SQLAlchemy models)
    model_config = ConfigDict(from_attributes=True)

class PostResVotes(BaseModel):
    Post : PostRes
    votes : int

    model_config = ConfigDict(from_attributes=True)

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None


class Vote(BaseModel):
    post_id: int
    dir: int = Field(gt=-1, lt=2)