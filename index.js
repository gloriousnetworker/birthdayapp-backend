const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to handle birthday wishes submission
app.post('/api/wishes', async (req, res) => {
  const { name, message } = req.body;

  // Validate request data
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Insert data into the Supabase table
    const { data, error } = await supabase
      .from('wishes')
      .insert([{ name: name || 'Anonymous', message }]);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Birthday Wish Sent Successfully!', data });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ error: 'Failed to submit birthday wish' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
