from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.

    All feature models (User, Transaction, etc.) should inherit from this:
        class User(Base):
            __tablename__ = "users"
            ...
    """

    pass
