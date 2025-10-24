-- Household information table for consumption comparison
-- This table stores user's household characteristics for benchmarking

CREATE TABLE household_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Household characteristics
  number_of_people INTEGER CHECK (number_of_people > 0),
  property_type VARCHAR(20) CHECK (property_type IN ('house', 'apartment')),
  house_size_m2 DECIMAL(8, 2) CHECK (house_size_m2 > 0),
  peb_rating VARCHAR(3) CHECK (peb_rating IN ('A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),

  -- Additional characteristics
  year_of_construction INTEGER,
  heating_type VARCHAR(50), -- electric, gas, fuel oil, heat pump, etc.
  has_solar_panels BOOLEAN DEFAULT false,
  has_electric_car BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Ensure one row per user
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_household_info_user_id ON household_info(user_id);

-- Enable RLS
ALTER TABLE household_info ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view and modify their own household info
CREATE POLICY "Users can view own household info"
  ON household_info FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own household info"
  ON household_info FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own household info"
  ON household_info FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own household info"
  ON household_info FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_household_info_updated_at
  BEFORE UPDATE ON household_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Reference data table for average consumption benchmarks
-- This will store general consumption averages based on household characteristics
CREATE TABLE consumption_benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Meter type reference
  meter_type_id UUID REFERENCES meter_types(id) ON DELETE CASCADE NOT NULL,

  -- Household characteristics range
  property_type VARCHAR(20) CHECK (property_type IN ('house', 'apartment', 'all')),
  people_min INTEGER,
  people_max INTEGER,
  size_min_m2 DECIMAL(8, 2),
  size_max_m2 DECIMAL(8, 2),
  peb_rating VARCHAR(3),

  -- Benchmark values (per year)
  average_consumption DECIMAL(12, 2) NOT NULL,
  low_consumption DECIMAL(12, 2), -- 25th percentile
  high_consumption DECIMAL(12, 2), -- 75th percentile

  -- Additional context
  source VARCHAR(255), -- Where this data comes from
  year INTEGER, -- Year of the data
  country VARCHAR(3) DEFAULT 'BEL',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster benchmark lookups
CREATE INDEX idx_benchmarks_meter_type ON consumption_benchmarks(meter_type_id);
CREATE INDEX idx_benchmarks_property_type ON consumption_benchmarks(property_type);

-- Enable RLS for benchmarks (everyone can read, only admins can write)
ALTER TABLE consumption_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view benchmarks"
  ON consumption_benchmarks FOR SELECT
  USING (true);

-- Insert some example benchmark data for Belgium
-- These are approximate values and should be replaced with real data

-- Get electricity meter type ID
DO $$
DECLARE
  electricity_id UUID;
  water_id UUID;
  gas_id UUID;
BEGIN
  -- Find meter type IDs
  SELECT id INTO electricity_id FROM meter_types WHERE name = 'Électricité';
  SELECT id INTO water_id FROM meter_types WHERE name = 'Eau';
  SELECT id INTO gas_id FROM meter_types WHERE name = 'Gaz';

  -- Electricity benchmarks (kWh/year)
  -- Small apartment, 1-2 people
  INSERT INTO consumption_benchmarks (meter_type_id, property_type, people_min, people_max, size_min_m2, size_max_m2, average_consumption, low_consumption, high_consumption, source, year)
  VALUES
    (electricity_id, 'apartment', 1, 2, 0, 75, 2000, 1500, 2500, 'Belgian average statistics', 2024),
    (electricity_id, 'apartment', 1, 2, 75, 100, 2500, 2000, 3000, 'Belgian average statistics', 2024),
    (electricity_id, 'apartment', 3, 4, 75, 120, 3500, 3000, 4200, 'Belgian average statistics', 2024),
    (electricity_id, 'house', 1, 2, 100, 150, 3500, 2800, 4200, 'Belgian average statistics', 2024),
    (electricity_id, 'house', 3, 4, 150, 200, 4500, 3800, 5500, 'Belgian average statistics', 2024),
    (electricity_id, 'house', 4, 6, 200, 300, 6000, 5000, 7500, 'Belgian average statistics', 2024);

  -- Gas benchmarks (m³/year)
  INSERT INTO consumption_benchmarks (meter_type_id, property_type, people_min, people_max, size_min_m2, size_max_m2, average_consumption, low_consumption, high_consumption, source, year)
  VALUES
    (gas_id, 'apartment', 1, 2, 0, 75, 1200, 800, 1600, 'Belgian average statistics', 2024),
    (gas_id, 'apartment', 1, 2, 75, 100, 1500, 1000, 2000, 'Belgian average statistics', 2024),
    (gas_id, 'apartment', 3, 4, 75, 120, 1800, 1400, 2400, 'Belgian average statistics', 2024),
    (gas_id, 'house', 1, 2, 100, 150, 2000, 1500, 2600, 'Belgian average statistics', 2024),
    (gas_id, 'house', 3, 4, 150, 200, 2500, 2000, 3200, 'Belgian average statistics', 2024),
    (gas_id, 'house', 4, 6, 200, 300, 3500, 2800, 4500, 'Belgian average statistics', 2024);

  -- Water benchmarks (m³/year)
  INSERT INTO consumption_benchmarks (meter_type_id, property_type, people_min, people_max, size_min_m2, size_max_m2, average_consumption, low_consumption, high_consumption, source, year)
  VALUES
    (water_id, 'all', 1, 1, 0, 999999, 40, 30, 55, 'Belgian average statistics', 2024),
    (water_id, 'all', 2, 2, 0, 999999, 80, 60, 100, 'Belgian average statistics', 2024),
    (water_id, 'all', 3, 3, 0, 999999, 110, 90, 140, 'Belgian average statistics', 2024),
    (water_id, 'all', 4, 4, 0, 999999, 140, 110, 180, 'Belgian average statistics', 2024),
    (water_id, 'all', 5, 10, 0, 999999, 170, 140, 220, 'Belgian average statistics', 2024);
END $$;
