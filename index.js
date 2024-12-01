const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Brand = require('./models/Brand');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://VIGNAN31:VIGNAN45@cluster0.b0qik.mongodb.net/branddb?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home page
app.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.render('index', { brands });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Add brand
app.post('/add', async (req, res) => {
  try {
    const newBrand = new Brand({
      name: req.body.name,
      description: req.body.description,
    });
    await newBrand.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding brand');
  }
});

// Edit brand
app.get('/edit/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send('Brand not found');
    res.render('edit', { brand });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Update brand
app.post('/edit/:id', async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).send('Name and description are required');
    }

    await Brand.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
    });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating brand');
  }
});

// Delete brand
app.post('/delete/:id', async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting brand');
  }
});

// Middleware
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
