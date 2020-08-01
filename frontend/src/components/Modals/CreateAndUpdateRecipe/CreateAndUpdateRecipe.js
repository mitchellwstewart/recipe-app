import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'
import InputForm from '../../Modals/InputForm/InputForm';
import { createRecipeMutation, updateRecipeMutation, cloudinaryUploadMutation, cloudinaryDeleteMutation } from '../../../graphqlQueries/queries'


class CreateAndUpdateModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewing: 'description',
      imageUploadQueue: [],
      // imageUploadQueuePreviews: [],
      uploadedCloudinaryLinks: [],
      imageDeleteQueue: [],
    }
  }
  static contextType = AuthContext
  componentDidMount() {
    document.querySelector('.main-content').classList.add('lock')
  }
  viewHandler = (e) => {
    this.setState({viewing: e.target.id})
  }

  modalConfirmHandler = async ({
    recipeName, recipeDescription,
    recipeIngredients, recipeSteps,
    tags, yields, minutesEstimate, link,
    currentRecipeImages }) => {
    try {
      if(this.state.imageUploadQueue.length) { //UPLOAD IMAGES TO CLOUDINARY AND SET IMAGE OBJECT IN this.state.uploadedCloudinaryLinks
        await this.uploadToCloudinary(this.state.imageUploadQueue, this.state.uploadedCloudinaryLinks, currentRecipeImages)
      }
      if(this.state.imageDeleteQueue.length) { //DELETE IMAGES FROM CLOUDINARY. Will later take mongoDB _ids from this.state.imageDeleteQueue
        await this.deleteFromCloudinary(this.state.imageDeleteQueue)
      }
      if(link.trim().length > 0 && recipeName.trim().length > 0) { this.setState({validationError: false}) }
      else if(
        recipeName.trim().length === 0 ||
        recipeIngredients.length === 0 ||
        recipeSteps.length === 0 ||
        yields <= 0 || 
        minutesEstimate <= 0 
      ){
        this.setState({validationError: true})
        setTimeout(()=> {
          this.setState({validationError: false})
        }, 3000)
        return;
      }

      const imageRefsToDelete = this.state.imageDeleteQueue.map(imageObj => imageObj.mongoId)
      const recipeId = this.props.isUpdate ? this.props.recipeToUpdate._id : null
      const defaultVariables = {
        recipeName: recipeName,
        recipeDescription: recipeDescription,
        recipeIngredients: recipeIngredients,
        recipeSteps: recipeSteps,
        yields: yields,
        minutesEstimate: minutesEstimate,
        date: new Date().toISOString(),
        link: link,
        imageLinks: this.state.uploadedCloudinaryLinks.length 
          ? [...currentRecipeImages, ...this.state.uploadedCloudinaryLinks].filter(image => !imageRefsToDelete.includes(image._id))
          : currentRecipeImages.filter(image => !imageRefsToDelete.includes(image._id)),
        tags: tags,
      }

      const updatedVariables = recipeId ? {...defaultVariables, recipeId} : defaultVariables
      const requestBody = {
        query: this.props.isUpdate ? updateRecipeMutation : createRecipeMutation,
        variables: updatedVariables
      };

      const token = this.context.token;
      const mongoRes = await fetch('http://localhost:3001/graphql', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
        if(mongoRes.status !== 200 && mongoRes.status !== 201) {
          throw new Error('Failed!')
        }
        const resData =  await mongoRes.json()
        if(this.props.isCreate) {
          const createdRecipe = {
            _id: resData.data.createRecipe._id,
            recipeName: resData.data.createRecipe.recipeName,
            recipeDescription: resData.data.createRecipe.recipeDescription,
            recipeIngredients: resData.data.createRecipe.recipeIngredients,
            recipeSteps: resData.data.createRecipe.recipeSteps,
            yields: resData.data.createRecipe.yields,
            minutesEstimate: resData.data.createRecipe.minutesEstimate,
            date: resData.data.createRecipe.date,
            link: resData.data.createRecipe.link,
            imageLinks: resData.data.createRecipe.imageLinks,
            tags: resData.data.createRecipe.tags,
            creator: {
              _id: this.context.userId,
            }
          }
          this.props.handleRecipesStateUpdate(createdRecipe, 'create')
        }
        else if (this.props.isUpdate) {
          console.log('resData.updateRecipe: ', resData.data)
          const updatedRecipe = {...resData.data.updateRecipe, creator: {_id: this.props.recipeToUpdate.creator._id}}
          console.log('updatedRecipe: ', updatedRecipe)
          this.props.handleRecipesStateUpdate(updatedRecipe, 'update')
        } 
     }
     catch(err) {
       throw err
     }
  }

  modalSubscribeToRecipeHandler = () => {
    if(!this.context.token) {
      this.setState({selectedRecipe: null})
      return;
    }
    const requestBody = {
      query: `
        mutation SubscripeToRecipe ($id: ID!) {
          subscribeToRecipe(recipeId: $id){
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.props.selectedRecipe._id
      }
    }
  
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
      }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      }).then(resData => {
        this.setState({selectedRecipe: null})
      })
      
      .catch(err => {
        throw err
    })
  }

  uploadToCloudinary = async (imageFilesForProcessing, uploadedCloudinaryLinks, currentRecipeImages) => {
    const imagesForCloudinary = []
    const requestBody = {
      query: cloudinaryUploadMutation,
      variables: {
        imagesForCloudinary: imageFilesForProcessing //images ready for upload to cloudinary
      }
    }
  
    const token = this.context.token;
    const cloudinaryRes = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + token
      }
    })
    if (cloudinaryRes.status !== 200 && cloudinaryRes.status !== 201) {
      throw new Error('Failed!')
    }
    const resData =  await cloudinaryRes.json()

    await this.setState(prevState => {
      return {uploadedCloudinaryLinks: [...prevState.uploadedCloudinaryLinks, ...resData.data.uploadToCloudinary.map(image => {
         const imageObj = !currentRecipeImages.length   //this is the first image, set as featured
           ? {link: image.secure_url, featured: true, public_id: image.public_id}
           : {link: image.secure_url, featured: false, public_id: image.public_id}
           return imageObj
        })
      ]}
    })
  }

  deleteFromCloudinary = async imagesToDelete => {
    const requestBody = {
      query: cloudinaryDeleteMutation,
      variables: {
        imageIdsToDelete: imagesToDelete //images ready for deletion from cloudinary
      }
    }
  
    const cloudinaryRes = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (cloudinaryRes.status !== 200 && cloudinaryRes.status !== 201) {
      throw new Error('Failed!')
    }
    const resData =  await cloudinaryRes.json()
    if(resData.data.deleteFromCloudinary) {
      return resData.data.deleteFromCloudinary
    }
  }

  updateImageDeleteQueue = async ({mongoId, cloudId}) => {
    //const imageToDelete = e.currentTarget.dataset.image
    await this.setState(prevState => {
      const deleteQueue = [...prevState.imageDeleteQueue,  {mongoId, cloudId}]
      return {imageDeleteQueue: deleteQueue}
    })
  }


  removeImageFromQueue = e => {
    let imageToRemove = e.currentTarget.dataset.image
    this.setState(prevState => {
      let newImageQueue = prevState.imageUploadQueue.filter(image => image.name !== imageToRemove )
      return {imageUploadQueue: newImageQueue}
    })
  }

  imageToBase64Handler = async e => {
    const imagesForUpload = [...e.target.files]
    console.log('imageToBase64Handler: ', imagesForUpload)

    const imagePromises = imagesForUpload.map(async fileObject => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(fileObject)
        reader.onloadend = async () => {
          resolve({name: fileObject.name, base64: reader.result})
        }
      })
    })

   await Promise.all([...imagePromises]).then(async base64Images => { 
      await this.setState(prevState => {
        return {imageUploadQueue: [...prevState.imageUploadQueue, ...base64Images]}
      })
      console.log('this.state.imageUploadQueue: ', this.state.imageUploadQueue)
    });

    
  }


  
  render() {
    console.log('this.props in parent modal:', this.props.canConfirm)
  return (
    <div className="modal create-update-modal z2">
      <nav className="modal__nav  bcdbl p0 m0 f jcb aic z3" >
      
      <header className="modal__header f jcb s12 ls1 ccr caps f fw6 aic">{this.props.isUpdate ? "Updating Recipe" : "Creating Recipe"}</header>
        <div className="py05 f aic pointer close-modal"  onClick={this.props.onCancel}>
        <ClearIcon/></div>
        </nav>
      
      {this.props.validationError && <p className="caps cr">Validation Error: Check your inputs!</p>}
      {this.props.isUpdate 
      ?  <InputForm       
        saveText={this.context.token && "Save Changes" }
        onCancel={this.props.onCancel.bind(this, 'update')} 
        onSaveChanges={this.modalConfirmHandler}
        updateRecipeHandler = {this.modalConfirmHandler}
        imageToBase64Handler = {this.imageToBase64Handler}
        updateImageDeleteQueue = {this.updateImageDeleteQueue}
        removeFromQueue = {this.removeImageFromQueue}
        imageUploadQueue = {this.state.imageUploadQueue}
        // imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
        recipeToUpdate = {this.props.recipeToUpdate}
        allTags={this.props.allTags}
        canConfirm = {this.props.canConfirm}
        canSaveChanges = {this.props.canSaveChanges}
      /> 
      : <InputForm 
        confirmText="Confirm"
        onCancel={this.props.onCancel} 
        onConfirm={this.modalConfirmHandler}
        updateRecipeHandler = {this.modalConfirmHandler}
        imageUploadQueue = {this.state.imageUploadQueue}
        // imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
        imageToBase64Handler = {this.imageToBase64Handler}
        removeFromQueue = {this.removeImageFromQueue}
        tagsEl = {this.props.tagsEl}
        newTagEl = {this.props.newTagEl}
        allTags={this.props.allTags}
        canConfirm = {this.props.canConfirm}
        canSaveChanges = {this.props.canSaveChanges}
      />
    }
    </div>
    )
  }
};

export default CreateAndUpdateModal;