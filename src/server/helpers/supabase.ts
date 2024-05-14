import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://mbcobsjjxvpydprpyybp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iY29ic2pqeHZweWRwcnB5eWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2OTIzODIsImV4cCI6MjAzMTI2ODM4Mn0.QbY8916TAy6y9KbRIe8ni0lPDU7Ezx2GLnlkFB03xj0"
);

export default supabase;
