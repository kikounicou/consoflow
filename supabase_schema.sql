-- Compteurs - Schéma de base de données Supabase

-- Table des types de compteurs
CREATE TABLE meter_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- kWh, m³, etc.
  icon VARCHAR(50), -- nom d'icône pour l'UI
  color VARCHAR(7), -- code couleur hex
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des emplacements (lieux)
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des compteurs
CREATE TABLE meters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  meter_type_id UUID REFERENCES meter_types(id) ON DELETE RESTRICT NOT NULL,
  name VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des relevés
CREATE TABLE readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meter_id UUID REFERENCES meters(id) ON DELETE CASCADE NOT NULL,
  reading_date TIMESTAMP WITH TIME ZONE NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  photo_url TEXT, -- URL de la photo du compteur (stockée dans Supabase Storage)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX idx_locations_user_id ON locations(user_id);
CREATE INDEX idx_meters_user_id ON meters(user_id);
CREATE INDEX idx_meters_location_id ON meters(location_id);
CREATE INDEX idx_meters_type_id ON meters(meter_type_id);
CREATE INDEX idx_readings_meter_id ON readings(meter_id);
CREATE INDEX idx_readings_date ON readings(reading_date DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meters_updated_at BEFORE UPDATE ON meters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at BEFORE UPDATE ON readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE meter_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour meter_types (lecture publique, écriture admin uniquement)
CREATE POLICY "Tous peuvent lire les types de compteurs" ON meter_types
  FOR SELECT USING (true);

-- Politiques RLS pour locations
CREATE POLICY "Utilisateurs peuvent lire leurs propres emplacements" ON locations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent créer leurs propres emplacements" ON locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent mettre à jour leurs propres emplacements" ON locations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres emplacements" ON locations
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour meters
CREATE POLICY "Utilisateurs peuvent lire leurs propres compteurs" ON meters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent créer leurs propres compteurs" ON meters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent mettre à jour leurs propres compteurs" ON meters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres compteurs" ON meters
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour readings
CREATE POLICY "Utilisateurs peuvent lire les relevés de leurs compteurs" ON readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meters WHERE meters.id = readings.meter_id AND meters.user_id = auth.uid()
    )
  );

CREATE POLICY "Utilisateurs peuvent créer des relevés pour leurs compteurs" ON readings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meters WHERE meters.id = readings.meter_id AND meters.user_id = auth.uid()
    )
  );

CREATE POLICY "Utilisateurs peuvent mettre à jour les relevés de leurs compteurs" ON readings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meters WHERE meters.id = readings.meter_id AND meters.user_id = auth.uid()
    )
  );

CREATE POLICY "Utilisateurs peuvent supprimer les relevés de leurs compteurs" ON readings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meters WHERE meters.id = readings.meter_id AND meters.user_id = auth.uid()
    )
  );

-- Insérer les types de compteurs par défaut
INSERT INTO meter_types (name, unit, icon, color) VALUES
  ('Électricité', 'kWh', 'zap', '#F59E0B'),
  ('Eau', 'm³', 'droplet', '#3B82F6'),
  ('Gaz', 'm³', 'flame', '#EF4444'),
  ('Personnalisé', 'unité', 'gauge', '#8B5CF6');

-- Vue pour les statistiques de consommation
CREATE OR REPLACE VIEW consumption_stats AS
SELECT
  m.id as meter_id,
  m.user_id,
  m.name as meter_name,
  mt.name as meter_type,
  mt.unit,
  r1.reading_date as current_date,
  r1.value as current_value,
  r2.reading_date as previous_date,
  r2.value as previous_value,
  (r1.value - r2.value) as consumption,
  EXTRACT(EPOCH FROM (r1.reading_date - r2.reading_date)) / 86400 as days_diff
FROM meters m
JOIN meter_types mt ON m.meter_type_id = mt.id
JOIN readings r1 ON m.id = r1.meter_id
LEFT JOIN LATERAL (
  SELECT reading_date, value
  FROM readings
  WHERE meter_id = m.id AND reading_date < r1.reading_date
  ORDER BY reading_date DESC
  LIMIT 1
) r2 ON true
WHERE m.is_active = true;
