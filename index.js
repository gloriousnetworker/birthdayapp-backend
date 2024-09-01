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

// API endpoint to handle birthday wishes submission (POST)
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

// API endpoint to retrieve a wish by user name (GET)
app.get('/api/wishes/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Fetch data from the Supabase table by name
    const { data, error } = await supabase
      .from('wishes')
      .select('name, message')
      .eq('name', name);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Wish not found for the given name' });
    }

    res.status(200).json({ message: 'Wish retrieved successfully!', data });
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    res.status(500).json({ error: 'Failed to retrieve wish' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
