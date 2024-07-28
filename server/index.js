const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const TodoModel = require('./Models/Todo');

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL;

if (!uri) {
  console.error('MongoDB URL is not set in environment variables.');
  process.exit(1);
}

// Connect to MongoDB using mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: { version: '1', strict: true, deprecationErrors: true }
}).then(() => {
  console.log('Connected to MongoDB');

  app.post('/add-item', async (req, res) => {
    const data = req.body.task;
    if (!data) {
      return res.status(400).json({ error: 'Task data is required' });
    }
    try {
      const result = await TodoModel.create({ task: data });
      res.json(result);
    } catch (err) {
      console.error('Error inserting item:', err);
      res.status(500).json({ error: 'Failed to add item' });
    }
  });

  app.get('/get-items', (req,res) => {
    TodoModel.find()
     .then(result => res.json(result))
     .catch(err => {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Failed to fetch items' });
      });
  })

  app.put('/update/:id', (req, res)=>{
    const {id} = req.params;
    TodoModel.findByIdAndUpdate({_id:id},{done:true})
    .then(result=> res.json(result))
    .catch(err => {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Failed to update item' });
      });
  })

  app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete({_id:id})
     .then(result=> res.json(result))
     .catch(err => {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Failed to delete item' });
      });
  })
  app.get('/', (req, res) => {
    res.send('Hello from Express Server!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
