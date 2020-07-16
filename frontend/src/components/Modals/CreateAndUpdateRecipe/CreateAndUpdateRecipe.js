import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'
import InputForm from '../../Modals/InputForm/InputForm';


class CreateAndUpdateModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewing: 'description'
    }
  }
  
  static contextType = AuthContext

  componentDidMount() {
    document.querySelector('.main-content').classList.add('lock')
   }
  viewHandler = (e) => {
    this.setState({viewing: e.target.id})
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
      onSaveChanges={this.props.modalConfirmHandler}
      updateRecipeHandler = {this.props.updateRecipeHandler}
      imageUploadHandler = {this.props.imageUploadHandler}
      updateImageDeleteQueue = {this.props.updateImageDeleteQueue}
      removeFromQueue = {this.props.removeImageFromQueue}
      imageUploadQueue = {this.props.imageUploadQueue}
      imageUploadQueuePreviews = {this.props.imageUploadQueuePreviews}
      recipeToUpdate = {this.props.recipeToUpdate}
      allTags={this.props.allTags}
      canConfirm = {this.props.canConfrim}
      canSaveChanges = {this.props.canSaveChanges}
      /> 
    : <InputForm 
      confirmText="Confirm"
      onCancel={this.props.modalCancelHandler} 
      onConfirm={this.props.modalConfirmHandler}
      updateRecipeHandler = {this.props.updateRecipeHandler}
      imageUploadQueue = {this.props.imageUploadQueue}
      imageUploadQueuePreviews = {this.props.imageUploadQueuePreviews}
      imageUploadHandler = {this.props.imageUploadHandler}
      removeFromQueue = {this.props.removeImageFromQueue}
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