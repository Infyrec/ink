const checkDiskSpace = require('check-disk-space').default
const fs = require('fs');
const path = require('path');
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
app.get('/readdisk', (req, res) => {
  try{
    let collection = []

    let waiter = new Promise((resolve, reject) => {
      fs.readdir(__dirname+'/uploads', (err, files) => {
        files.forEach(file => {
    
          let fileDetails = fs.lstatSync(path.resolve(__dirname+'/uploads', file));
    
          if (fileDetails.isDirectory()) {
            console.log('Directory: ' + file);
            console.log('Details: ' + JSON.stringify(fileDetails));
          } 
          else {
            let metadata = {
              name: file.split('.')[0],
              type: file.split('.')[1],
              size: Math.round(fileDetails.size/1024**2) + ' MB'
            }
            collection.push(metadata)
          }
        });
        resolve()
      });
    })
    
    waiter.then(() => {
      res.status(200).json({type: 'success', files: collection, message: 'Iterated files successfully'})
    })
  }
  catch(e){
    res.send(500).json({type: 'failed', message: 'Failed to fetch files and folders.'})
  }
})


// Handle file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({status: 'success', message: 'File uploaded successfully'});
});


// Start server
app.listen(3002, () => {
  console.log(`Storage Server is running on port 3002`);
});