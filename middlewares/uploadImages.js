const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now()+'-'+ Math.round(Math.random()*1e9);
        cb(null, file.fieldname+'-'+uniqueSuffix+'.jpeg');
    },
});

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else {
        cb({
            message: "Unsupported file format",
        }, false );
    }
};


const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 1024*2 }, 
});

const productImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(req.files
        .map(async function(file) {
            await sharp(file.path)
                // .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({quality:80})
                .toFile(`public/images/products/${file.filename}`);
                file.path = `public/images/products/${file.filename}`;
            fs.unlinkSync(`public/images/${file.filename}`);
            // attemptDeletion(file.path);
        })
    );
    next();
};

const blogImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all( req.files 
        .map(async (file)=>{
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality:90 })
                .toFile(`public/images/blogs/${file.filename}`);
                // fs.unlinkSync(`public/images/${file.filename}`);
                fs.unlinkSync(`${file.path}`);
                file.path = `public/images/blogs/${file.filename}`;
            })
    );
    next();
};

//   Call the attemptDeletion function in your code
// const attemptDeletion = (path, maxRetries = 5) => {
//     let retries = 0;
//     const retryInterval = 100; // Delay in milliseconds
  
//     const tryDelete = () => {
//       try {
//         fs.unlinkSync(path);
//         console.log(`File deleted successfully: ${path}`);
//       } catch (err) {
//         if (retries < maxRetries) {
//           retries++;
//           setTimeout(tryDelete, retryInterval);
//         } else {
//           console.error(`Failed to delete file: ${path}`);
//         }
//       }
//     };
  
//     tryDelete();
//   };
  


module.exports = {
    uploadPhoto, productImgResize, blogImgResize,
}