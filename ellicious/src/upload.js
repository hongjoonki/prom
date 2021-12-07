import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import './env';
import s3Storage from 'multer-sharp-s3';

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_BUCKET,
//   secretAccessKey: process.env.AWS_BUCKET_SECRET,
//   region: "ap-northeast-2"
// });


// const upload = multer({
//   storage: multerS3({
//     s3,
//     acl: "public-read",
//     bucket: "elliciouscontainer",
//     metadata: function(req, file, cb) {
//       console.log(file);
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function(req, file, cb) {
//       cb(null, Date.now().toString()+".jpg");
//     }
//   })
// });

aws.config.update({
  secretAccessKey: process.env.AWS_BUCKET_SECRET, // Not working key, Your SECRET ACCESS KEY from AWS should go here, never share it!!!
  accessKeyId: process.env.AWS_BUCKET, // Not working key, Your ACCESS KEY ID from AWS should go here, never share it!!!
  region: "ap-northeast-2", // region of your bucket
})
 
const s3 = new aws.S3()

const storage = s3Storage({
  s3,
  Bucket: "elliciouscontainer",
  Key: function(req, file, cb) {
    cb(null, Date.now().toString()+".jpg");
  },
  ACL: "public-read",
  resize: {
    width: 800,
    height: 800,
  },
  multiple:true
})
const upload = multer({ storage: storage })



export const uploadMiddleware = upload.array("file",10);

export const uploadController = (req, res) => {
  const temp=[]
  req.files.forEach((element, i) => {
    temp[i] = element.Location
  })
  res.json({temp});
};

