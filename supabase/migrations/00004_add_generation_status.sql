-- Add generation status columns to comments
ALTER TABLE comments 
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
ADD COLUMN error TEXT,
ADD COLUMN fal_request_id TEXT,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for status queries
CREATE INDEX idx_comments_status ON comments(status);
