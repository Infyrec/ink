const checkDiskSpace = require('check-disk-space').default
const fs = require('fs').promises;
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const FileModel = require('./schema/fileModel');

const app = express();
app.use(cors())
app.use(express.json())

const dbConnect = process.env.DATABASE_URL
mongoose.connect(dbConnect);
const database = mongoose.connection

database.once('connected', () => {
    console.log('Database Connected');
})

database.on('error', (error) => {
    console.log(error)
})

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


// To fetch the disk space
app.get('/diskspace', (req, res) => {
  try{
    checkDiskSpace(__dirname+'/uploads').then((diskSpace) =>{
      res.status(200).json({
        free: diskSpace.free / 1024**3,
        size: diskSpace.size / 1024**3
      })
    })
  }
  catch(e){
    res.status(500).json({type: 'failed', message: 'Failed to fetch disk space.'})
  }
})

// To read folder/files
app.get('/readfiles', async(req, res) => {
  try{
    let files = await FileModel.find({})
    res.status(200).json({type: 'success', files: files, message: 'Iterated files successfully'})
  }
  catch(e){
    res.send(500).json({type: 'failed', message: 'Failed to fetch files and folders.'})
  }
})


// Handle file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({status: 'success', message: 'File uploaded successfully'});
});

// To register uploaded file in database
app.post('/registerUpload', async(req, res) => {
  let { uid, file, size, type, date, location, meta } = req.body
  try{
    let data = new FileModel({
      uid: uid,
      file: file,
      size: size,
      type: type,
      date: date,
      location: location,
      meta: meta
    })
    const dataToSave = await data.save();
    res.status(200).send({status: 'success', message: 'File metadata registered successfully'})
  }
  catch(e){
      res.status(400).send({status: 'failed', message: 'Failed to register metadata'})
  }
})

// To handle download request
app.get('/download', (req, res) => {
    try{
        res.download(__dirname+'/uploads/'+req.query.file)
    }
    catch(e){
        res.status(400).send('File not found.')
    }
})


// To handle file delete operation
app.post('/delete', async(req, res) => {
  try{
    await fs.unlink(__dirname+'/uploads/'+req.body.file);
    let result = await FileModel.findOneAndDelete({ uid: req.body.uid })
    res.status(200).send({status: 'success', message: 'File deleted successfully'})
  }
  catch(e){
    res.status(400).send('File not found to delete.')
  }
})


// Start server
app.listen(3002, () => {
  console.log(`Storage Server is running on port 3002`);
});