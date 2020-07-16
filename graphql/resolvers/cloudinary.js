const axios  = require('axios')
//const cloudinary = require('cloudinary-core')
// var cloudinary = require('cloudinary').v2
// require('dotenv').config()

require('dotenv').config();
var fs = require('fs');
var cloudinary = require('cloudinary').v2;

module.exports = {
    uploadToCloudinary: async args => {
      console.log('hey are we hitting this?')
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
        try {
          args.imagesForCloudinary.forEach(image => {
            console.log('image: ', image.name)
              
          })
          const uploadPromises = args.imagesForCloudinary.map(async imageFile => {
            return new Promise((resolve, reject) => {
              resolve(cloudinary.uploader.upload(imageFile.base64, {}))
            })
          })
      
         const cloudinaryResponse = await Promise.all([...uploadPromises])
          console.log("cloudinaryImages: ", cloudinaryResponse)
          const cloudinaryImages =  cloudinaryResponse.map(res => {
            return {secure_url: res.secure_url, resource_type: res.resource_type}
          })
          console.log('cloudinaryImages: ', cloudinaryImages)

          return cloudinaryImages
        }
        catch(err) {
          console.log('err: ', err)
            throw err
        }
        
    },
    deleteImages: async ({ email, password }) => {
       
    }
}