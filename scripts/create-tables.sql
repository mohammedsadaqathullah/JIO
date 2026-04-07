-- Create user_signups table for storing location and phone data
CREATE TABLE IF NOT EXISTS user_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  phone_number VARCHAR(15),
  location_permitted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_user_signups_phone ON user_signups(phone_number);

-- Create index on created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_user_signups_created_at ON user_signups(created_at);
