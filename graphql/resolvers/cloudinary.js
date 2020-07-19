const axios  = require('axios')
//const cloudinary = require('cloudinary-core')
// var cloudinary = require('cloudinary').v2
// require('dotenv').config()

require('dotenv').config();
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = {
    uploadToCloudinary: async args => {
      console.log('Backend upload to cloudinary: ', args.imagesForCloudinary)
        try {
          const uploadPromises = args.imagesForCloudinary.map(async imageFile => {
            return new Promise((resolve, reject) => {
              resolve(cloudinary.uploader.upload(imageFile.base64, {}))
            })
          })
      
         const cloudinaryResponse = await Promise.all([...uploadPromises])
          const cloudinaryImages =  cloudinaryResponse.map(res => {
            return {secure_url: res.secure_url, resource_type: res.resource_type, public_id: res.public_id}
          })
          return cloudinaryImages
        }
        catch(err) {
          console.log('err: ', err)
            throw err
        }
        
    },
    deleteFromCloudinary: async (args) => {
      console.log('DELETE: ')
      const cloudIds = args.imageIdsToDelete.map(imageObj => imageObj.cloudId)
      const mongoIds = args.imageIdsToDelete.map(imageObj => imageObj.mongoId)
      console.log('cloudIds: ', cloudIds)
      try {
        await cloudinary.api.delete_resources(cloudIds, (error, result) => {
        });
        return  mongoIds 
      }
      catch(err) {
        console.log('err: ', err)
          throw err
      }      
    }
}