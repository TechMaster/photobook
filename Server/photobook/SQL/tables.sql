
CREATE TABLE photo
(
  id serial NOT NULL, -- Primary key
  title character varying(255) NOT NULL,
  path character varying(255) NOT NULL,
  CONSTRAINT "PKey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE photo
  OWNER TO tom;
COMMENT ON COLUMN photo.id IS 'Primary key';