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

/*---------------------- To read files and disk space ----------------------*/
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

app.get('/readfiles', async(req, res) => {
  try{
    let files = await FileModel.find({})
    res.status(200).json({type: 'success', files: files, message: 'Iterated files successfully'})
  }
  catch(e){
    res.send(500).json({type: 'failed', message: 'Failed to fetch files and folders.'})
  }
})


/*---------------------- To handle file upload from web ----------------------*/
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({status: 'success', message: 'File uploaded successfully'});
});

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

    let original = __dirname+'/uploads/'+file
    let renamed = __dirname+'/uploads/'+uid+'.'+file.split('.')[1]

    fs.rename(original, renamed, () => { 
      console.log("File Renamed!"); 
    });

    res.status(200).send({status: 'success', message: 'File metadata registered successfully'})
  }
  catch(e){
      res.status(400).send({status: 'failed', message: 'Failed to register metadata'})
  }
})


/*---------------------- To handle file upload from app ----------------------*/
app.patch('/app/upload', upload.single('file'), (req, res) => {
  res.status(200).json({status: 'success', payload: req.file, message: 'File uploaded successfully'});
  // res.end('OK');
});

app.post('/app/registerUpload', async(req, res) => {
  let { uid, file, extension, type, size, date, location } = req.body

  try{
    let data = new FileModel({
      uid: uid,
      file: file,
      extension: extension,
      type: type,
      size: size,
      date: date,
      location: location
    })
    const dataToSave = await data.save();

    res.status(200).send({status: 'success', message: 'File metadata registered successfully'})
  }
  catch(e){
      res.status(400).send({status: 'failed', message: 'Failed to register metadata'})
  }
})


/*---------------------- To handle file download ----------------------*/
app.get('/download', (req, res) => {
    try{
        //res.download(__dirname+'/uploads/'+req.query.file)
        res.sendFile(__dirname+'/uploads/'+req.query.file)
    }
    catch(e){
        res.status(400).send('File not found.')
    }
})

/*---------------------- To handle file delete ----------------------*/
app.post('/delete', async(req, res) => {
  try{
    let file = req.body.uid + '.' + req.body.file.split('.')[1]

    await fs.unlink(__dirname+'/uploads/'+file);
    let result = await FileModel.findOneAndDelete({ uid: req.body.uid })
    res.status(200).send({status: 'success', message: 'File deleted successfully'})
  }
  catch(e){
    res.status(400).send('File not found to delete.')
  }
})

app.post('/app/delete', async(req, res) => {
  try{
    let file = req.body.uid

    await fs.unlink(__dirname+'/uploads/'+file);
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