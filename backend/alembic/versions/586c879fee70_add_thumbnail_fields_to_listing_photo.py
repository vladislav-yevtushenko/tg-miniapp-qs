"""add_thumbnail_fields_to_listing_photo

Revision ID: 586c879fee70
Revises: 0ecb4cccc083
Create Date: 2025-11-04 12:49:08.321381

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '586c879fee70'
down_revision: Union[str, Sequence[str], None] = '0ecb4cccc083'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('listing_photos', sa.Column('thumbnail_data', sa.Text(), nullable=True))
    op.add_column('listing_photos', sa.Column('file_size_bytes', sa.Integer(), nullable=True))
    op.add_column('listing_photos', sa.Column('original_filename', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('listing_photos', 'original_filename')
    op.drop_column('listing_photos', 'file_size_bytes')
    op.drop_column('listing_photos', 'thumbnail_data')
