const express = require('express');
const multer = require('multer');
const cors = require('cors')
const app = express();

app.use(cors())

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send('Upload server is working fine...!')
})

// Handle file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ status: 'success', message: 'File uploaded successfully' });
});

// Start server
app.listen(3002, () => {
  console.log(`Server is running on port 3002`);
});