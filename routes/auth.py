
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import connection, models
from modules.auth import service
from schemas.auth import UserCreate, ForgotPasswordRequest, ResetPasswordRequest, UserLoginJSON
import uuid
import datetime
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(connection.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = models.User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        hashed_password=service.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        credits=15 # Bonus credits for registering
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "success", "user_id": user.id}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(connection.get_db)):
    print(f"[DEBUG] FORM LOGIN ATTEMPT: {form_data.username}")
    try:
        user = db.query(models.User).filter(models.User.email == form_data.username).first()
        if not user or not service.verify_password(form_data.password, user.hashed_password):
            print(f"[DEBUG] FORM LOGIN FAILED: {form_data.username}")
            return JSONResponse(
                status_code=400,
                content={"error": True, "detail": "Invalid credentials"}
            )
        
        user.last_login = datetime.datetime.utcnow()
        db.commit()
        
        access_token = service.create_access_token(data={"sub": user.id})
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "full_name": user.full_name
        }
    except Exception as e:
        print(f"[DEBUG] CRITICAL FORM AUTH ERROR: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": True, "detail": "Internal authentication nexus failure"}
        )

@router.post("/json-login")
def json_login(credentials: UserLoginJSON, db: Session = Depends(connection.get_db)):
    print(f"[DEBUG] JSON LOGIN ATTEMPT: {credentials.email}")
    try:
        user = db.query(models.User).filter(models.User.email == credentials.email).first()
        if not user or not service.verify_password(credentials.password, user.hashed_password):
            print(f"[DEBUG] JSON LOGIN FAILED: {credentials.email}")
            return JSONResponse(
                status_code=400,
                content={"error": True, "detail": "Invalid credentials"}
            )
        
        user.last_login = datetime.datetime.utcnow()
        db.commit()
        
        access_token = service.create_access_token(data={"sub": user.id})
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "full_name": user.full_name
        }
    except Exception as e:
        print(f"[DEBUG] CRITICAL JSON AUTH ERROR: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": True, "detail": "Internal authentication nexus failure"}
        )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(connection.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        token = str(uuid.uuid4())
        user.reset_token = token
        user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        db.commit()
        return {"message": "If the email exists, a reset link has been sent.", "dev_token": token}
    return {"message": "If the email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(connection.get_db)):
    user = db.query(models.User).filter(
        models.User.reset_token == req.token,
        models.User.reset_token_expiry > datetime.datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user.hashed_password = service.get_password_hash(req.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return {"status": "Password reset successful"}
