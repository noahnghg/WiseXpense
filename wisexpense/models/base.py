from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.

    All feature models (Transaction, etc.) should inherit from this:
        class Transaction(Base):
            __tablename__ = "transactions"
            ...
    """

    pass
