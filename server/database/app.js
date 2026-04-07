const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/dealershipsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

const reviewSchema = new mongoose.Schema({
  id: Number,
  name: String,
  dealership: Number,
  review: String,
  purchase: Boolean,
  purchase_date: String,
  car_make: String,
  car_model: String,
  car_year: Number,
});

const dealerSchema = new mongoose.Schema({
  id: Number,
  city: String,
  state: String,
  st: String,
  address: String,
  zip: String,
  lat: String,
  long: String,
  short_name: String,
  full_name: String,
});

const Reviews = mongoose.model('Reviews', reviewSchema);
const Dealers = mongoose.model('Dealers', dealerSchema);

app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealers.find();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealers.find({ st: req.params.state });
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealers.findOne({ id: req.params.id });
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Reviews.find({ dealership: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/insertReview', async (req, res) => {
  try {
    const review = new Reviews(req.body);
    await review.save();
    res.json({ status: 200, message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Dealer/Review microservice running on port ${port}`);
});
