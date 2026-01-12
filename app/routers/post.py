from ast import mod
from typing import List, Optional
from fastapi import HTTPException, status, Response, Depends, APIRouter
from sqlalchemy.orm import Session, Query
from sqlalchemy import func
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[schemas.PostResVotes])
# @router.get("/")
def root(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_optional),
    limit: int = 10,
    skip: int = 0,
    search: Optional[str] = "",
):

    # only returns posts for logged in user
    # posts_query : Query = db.query(models.Post).filter(models.Post.owner_id == current_user.id)

    # returns all the posts in DB
    # posts_query: Query = (
    #     db.query(models.Post)
    #     .filter(models.Post.title.contains(search))
    #     .limit(limit)
    #     .offset(skip)
    # )

    # to get the votes count and also adding the filter in the end
    results: Query = (
        db.query(models.Post, func.count(models.Vote.post_id).label("votes"))
        .join(models.Vote, models.Vote.post_id == models.Post.id, isouter=True)
        .group_by(models.Post.id)
        .filter(models.Post.title.contains(search))
        .limit(limit)
        .offset(skip)
        .all()
    )

    # posts = posts_query.all()
    # curr.execute("""SELECT * FROM posts """)
    # posts = curr.fetchall()
    return results


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.PostRes)
def post_req(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):

    # print(curretnt_user.email)

    # curr.execute(
    #     """INSERT INTO posts (title, content, published) VALUES (%s, %s, %s) RETURNING *""",
    #     (post.title, post.content, post.published),
    # )
    # new_post = curr.fetchone()
    # conn.commit()

    # new_post = models.Post(
    #     title=post.title, content=post.content, published=post.published
    # )

    # imporoved than above
    new_post = models.Post(
        owner_id=current_user.id, **post.model_dump()
    )  # essentially we dont have to do the above steps (post.title etc.. )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.get("/{id}", response_model=schemas.PostResVotes)
def get_posts(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user_optional),
):

    # curr.execute("""SELECT * FROM posts WHERE id= %s""", (id,))
    # post = curr.fetchone()

    # post = (
    #     db.query(models.Post).filter(models.Post.id == id).first()
    # )  # first() is like fetchone and .all() is like fetchall
    # print(post)

    post = (
        db.query(models.Post, func.count(models.Vote.post_id).label("votes"))
        .join(models.Vote, models.Vote.post_id == models.Post.id, isouter=True)
        .group_by(models.Post.id)
        .filter(models.Post.id == id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"post with id: {id} not found",
        )

    return post


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):

    # curr.execute("""DELETE FROM posts WHERE id = %s RETURNING *""", (id,))
    # deleted_post = curr.fetchone()
    # conn.commit()

    post_query: Query = db.query(models.Post).filter(models.Post.id == id)

    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"post with id: {id} not found",
        )

    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="not authorized to peform requested action",
        )

    post_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.PostRes)
def update_post(
    id: int,
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user),
):

    # curr.execute(
    #     """UPDATE posts SET title=%s, content=%s, published=%s  WHERE id= %s RETURNING *""",
    #     (post.title, post.content, post.published, str(id)),
    # )
    # updated_post = curr.fetchone()
    # conn.commit()

    post_query: Query = db.query(models.Post).filter(models.Post.id == id)

    post_check = post_query.first()

    if not post_check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"post with id: {id} is not found",
        )

    if post_check.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="not authorized to peform requested action",
        )

    post_query.update(post.model_dump(), synchronize_session=False)

    db.commit()

    # return Response(status_code=status.HTTP_201_CREATED)
    return post_query.first()
