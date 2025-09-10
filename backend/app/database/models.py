"""
SQLAlchemy models for the metal piece measurement system.
Defines the four main tables: materials, suppliers, inventory_items, and price_history.
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Material(Base):
    """
    Materials table - represents different types of metal materials.
    """
    __tablename__ = "materials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    material_type = Column(String(50), nullable=False)  # e.g., 'steel', 'aluminum', 'copper'
    density = Column(Numeric(10, 4), nullable=True)  # kg/m³
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory_items = relationship("InventoryItem", back_populates="material")


class Supplier(Base):
    """
    Suppliers table - represents companies that supply materials.
    """
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    contact_person = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory_items = relationship("InventoryItem", back_populates="supplier")


class InventoryItem(Base):
    """
    Inventory items table - represents individual metal pieces in inventory.
    """
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    
    # Physical measurements (in mm)
    width = Column(Numeric(10, 3), nullable=False)
    height = Column(Numeric(10, 3), nullable=False)
    depth = Column(Numeric(10, 3), nullable=False)
    
    # Calculated properties
    volume = Column(Numeric(15, 6), nullable=True)  # mm³
    weight = Column(Numeric(10, 3), nullable=True)  # grams
    
    # Inventory management
    quantity = Column(Integer, default=1)
    unit_cost = Column(Numeric(10, 2), nullable=True)  # cost per unit
    location = Column(String(100), nullable=True)  # warehouse location
    batch_number = Column(String(50), nullable=True)
    
    # Quality and notes
    quality_grade = Column(String(10), nullable=True)  # A, B, C, etc.
    notes = Column(Text, nullable=True)
    
    # Status tracking
    is_available = Column(Boolean, default=True)
    reserved_until = Column(DateTime, nullable=True)
    
    # Timestamps
    received_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    material = relationship("Material", back_populates="inventory_items")
    supplier = relationship("Supplier", back_populates="inventory_items")
    price_history = relationship("PriceHistory", back_populates="inventory_item")


class PriceHistory(Base):
    """
    Price history table - tracks price changes for inventory items over time.
    """
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    
    # Price information
    price_per_unit = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="EUR")  # ISO currency code
    
    # Price context
    price_type = Column(String(20), nullable=False)  # 'purchase', 'sale', 'valuation'
    supplier_quote = Column(Boolean, default=False)
    market_price = Column(Boolean, default=False)
    
    # Metadata
    effective_date = Column(DateTime, nullable=False)
    source = Column(String(100), nullable=True)  # where price came from
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(100), nullable=True)  # user who entered the price
    
    # Relationships
    inventory_item = relationship("InventoryItem", back_populates="price_history")