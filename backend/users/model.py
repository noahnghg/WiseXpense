from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Plaid integration
    plaid_access_token = Column(String, nullable=True)
    plaid_cursor = Column(String, nullable=True)

    # Relationships
    transactions = relationship("Transaction", back_populates="user", lazy="dynamic")
