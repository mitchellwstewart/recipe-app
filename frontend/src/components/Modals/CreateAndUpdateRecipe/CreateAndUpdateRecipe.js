import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'
import InputForm from '../../Modals/InputForm/InputForm';
import { createRecipeMutation, updateRecipeMutation, cloudinaryUploadMutation } from '../../../graphqlQueries/queries'


class CreateAndUpdateModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewing: 'description',
      imageUploadQueue: [],
      imageUploadQueuePreviews: [],
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
      if(this.state.imageUploadQueue.length) { //REMOVE ! WHEN DONE TESTING
        console.log('this.state.imageUploadQueue: ', this.state.imageUploadQueue)
        await this.uploadToCloudinary(this.state.imageUploadQueuePreviews, this.state.uploadedCloudinaryLinks, currentRecipeImages)
      }

    //  if(this.state.imageDeleteQueue.length) {
    //    this.deleteFromCloudinary(this.state.imageDeleteQueue)
    //  }
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
        imageLinks: this.state.uploadedCloudinaryLinks.length ? [...currentRecipeImages, ...this.state.uploadedCloudinaryLinks] : currentRecipeImages,
        tags: tags,
      }

      const updatedVariables = recipeId ? {...defaultVariables, recipeId} : defaultVariables
      const requestBody = {
        query: this.props.isUpdate ? updateRecipeMutation : createRecipeMutation,
        variables: updatedVariables
      };

      console.log('requestBody: ', requestBody)
      const token = this.context.token;
      const mongoRes = await fetch('http://localhost:3001/graphql', {
          method: 'POST',
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
          console.log("resData from create/update: ", resData)
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
            
            this.props.handleRecipesStateUpdate(createdRecipe)
            
          }
          else if (this.props.isUpdate) {
            console.log("resData.data.updateRecipe: ", resData.data.updateRecipe)
            const updatedRecipe = {...resData.data.updateRecipe, creator: {_id: this.props.recipeToUpdate.creator._id}}
            console.log("UPDATED RECIPE: ", updatedRecipe)
            this.props.handleRecipesStateUpdate(updatedRecipe, true)
            
          } 
     }
     catch(err) {
       throw err
     }
  }

  modalDeleteRecipeHandler = () => {
    if(!this.context.token) {
      this.setState({selectedRecipe: null})
      return;
    }
    
    const requestBody = {
      query: `
        mutation DeleteRecipe ($id: ID!) {
          deleteRecipe(recipeId: $id){
            _id
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
        console.log("resData delete: ", resData)
        this.setState(prevState => {
          return {  
                  creating: false,
                  selectedRecipe: null,
                  recipes: prevState.recipes.filter(recipe => recipe._id !== resData.data.deleteRecipe._id)
                }
        })
 

        this.setState({recipesInSearch: this.state.recipes})
        
      })
      .catch(err => {
        throw err
      })
  }

  modalCancelHandler = () => {
    document.querySelector('body').classList.remove('lock')
    this.setState({creating: false, selectedRecipe: null, updating: false, recipeToUpdate: false})
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
    
    console.log('imageFilesForProcessing: ', imageFilesForProcessing)


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
        'Authorization': 'Bearer ' + token
      }
    })
    if (cloudinaryRes.status !== 200 && cloudinaryRes.status !== 201) {
      throw new Error('Failed!')
    }
    const resData =  await cloudinaryRes.json()
    console.log('cloudinary resData: ', resData)

    await this.setState(prevState => {
      return {uploadedCloudinaryLinks: [...prevState.uploadedCloudinaryLinks, ...resData.data.uploadToCloudinary.map(image => {
        // !currentRecipeImages.length && !newImageLinks.length  //this is the first image, set as featured
        //   ? newImageLinks.push({link: res.data.secure_url, featured: true})
        //   : newImageLinks.push({link: res.data.secure_url, featured: false})

        return {link: image.secure_url, featured: false} //update code above to set true or false feature
      })]}
    })

    console.log('this.state.uploadedCloudinaryLinks: ', this.state.uploadedCloudinaryLinks)


  }

  deleteFromCloudinary = images => {
    console.log('delete images from coudinary: ', images)
  }

  updateImageDeleteQueue = async imageId => {
    //const imageToDelete = e.currentTarget.dataset.image
    console.log('IMAGE DELETE HANDLER: ', imageId)
    await this.setState(prevState => {
      let newImageDeleteQueue = [...prevState.imageDeleteQueue, imageId]
      console.log('new delete queue: ', newImageDeleteQueue)
      return {imageDeleteQueue: newImageDeleteQueue}
    })
    console.log('images to delete from Cloudinary: ', this.state.imageDeleteQueue)
  }


  removeImageFromQueue = e => {
    let imageToRemove = e.currentTarget.dataset.image
    this.setState(prevState => {
      let newImageQueue = prevState.imageUploadQueue.filter(image => image.name !== imageToRemove )
      return {imageUploadQueue: newImageQueue}
    })
  }

  imageUploadHandler = async e => {
    console.log(e.target.files)

    const imagesForUpload = e.target.files
    await this.setState(prevState => {
      return {imageUploadQueue: [...imagesForUpload, ...prevState.imageUploadQueue]}
    })


    const imagePromises = this.state.imageUploadQueue.map(async fileObject => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(fileObject)
        reader.onloadend = async () => {
          // await this.setState( prevState => {
          //   console.log('setting state: ', prevState.imageUploadQueuePreviews)
          //   return {imageUploadQueuePreviews: [...prevState.imageUploadQueuePreviews, {name: fileObject.name, base64: reader.result}]}
          // })
          //console.log('this.state.imageUploadQueuePreviews: ', this.state.imageUploadQueuePreviews)
          resolve({name: fileObject.name, base64: reader.result})
        }
      })
    })

   await Promise.all([...imagePromises]).then(async base64Images => { 
      await this.setState(prevState => {
        return {imageUploadQueuePreviews: [...prevState.imageUploadQueuePreviews, ...base64Images]}
      })

      console.log('this.state.imageUploadQueuePrevies: ', this.state.imageUploadQueuePreviews)
    });
  }


  
  render() {
    console.log('create and update this.props: ', this.props)
  return (
    <div className="modal create-update-modal z2">
      <nav className="modal__nav  bcdbl p0 m0 f jcb aic z3" >
      
      <header className="modal__header f jcb s12 ls1 ccr caps f fw6 aic">{this.props.isUpdate ? "Updating Recipe" : "Creating Recipe"}</header>
        <div className="p05 f aic pointer close-modal"  onClick={this.props.onCancel}>
        <ClearIcon/></div>
        </nav>
      
      {this.props.validationError && <p className="caps cr">Validation Error: Check your inputs!</p>}
      {this.props.isUpdate 
      ?  <InputForm       
      saveText={this.context.token && "Save Changes" }
      //onCancel={this.props.modalCancelHandler.bind(this, 'update')} 
      onSaveChanges={this.modalConfirmHandler}
      updateRecipeHandler = {this.modalConfirmHandler}
      imageUploadHandler = {this.imageUploadHandler}
      updateImageDeleteQueue = {this.updateImageDeleteQueue}
      removeFromQueue = {this.removeImageFromQueue}
      imageUploadQueue = {this.state.imageUploadQueue}
      imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
      recipeToUpdate = {this.props.recipeToUpdate}
      allTags={this.props.allTags}
      canConfirm = {this.props.canConfrim}
      canSaveChanges = {this.props.canSaveChanges}
      /> 
    : <InputForm 
      confirmText="Confirm"
      onCancel={this.modalCancelHandler} 
      onConfirm={this.modalConfirmHandler}
      updateRecipeHandler = {this.modalConfirmHandler}
      imageUploadQueue = {this.state.imageUploadQueue}
      imageUploadQueuePreviews = {this.state.imageUploadQueuePreviews}
      imageUploadHandler = {this.imageUploadHandler}
      removeFromQueue = {this.removeImageFromQueue}
      tagsEl = {this.props.tagsEl}
      newTagEl = {this.props.newTagEl}
      allTags={this.props.allTags}
      canConfirm = {this.props.canConfrim}
      canSaveChanges = {this.props.canSaveChanges}
    />
    
    }
 
    </div>
    )
  }
};

export default CreateAndUpdateModal;