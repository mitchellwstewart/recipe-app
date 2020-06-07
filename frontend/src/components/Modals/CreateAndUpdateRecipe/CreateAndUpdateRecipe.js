import React, { Component } from 'react'
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'



class CreateAndUpdateModal extends Component {
  state = {
    viewing: 'description'
  }
  constructor(props) {
    super(props)
  }
  
  static contextType = AuthContext

  viewHandler = (e) => {
    this.setState({viewing: e.target.id})
  }
  render() {
    if(this.props.selectedRecipe) {
      const recipeName = this.props.selectedRecipe.recipeName
      const description = this.props.selectedRecipe.recipeDescription
      const ingredients = this.props.selectedRecipe.recipeIngredients
      const steps = this.props.selectedRecipe.recipeSteps
      const estimateTime = this.props.selectedRecipe.minutesEstimate
      const dateAdded = new Date(this.props.selectedRecipe.date).toLocaleDateString()
      const recipeLink = this.props.selectedRecipe.link
    }
    
    
  return (
    <div className="modal create-update-modal z2">
      <nav className="modal__nav pointer bcbl p0 m0 f" onClick={this.props.onCancel}><p>{`<- Back To Recipes`}</p></nav>
        <header>{this.props.isUpdate ? "Update Recipe" : "Create Recipe"}</header>
      {this.props.children}
      <div className="modal__header_actions f fdc jce p1">
      {this.props.canConfirm && 
      <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText } </button> }
        {this.props.canSaveChanges && <button className="btn" 
         onClick={this.props.onSaveChanges}>
        {this.props.saveText }
      </button> 
      }
      </div>
    </div>
    )
  }
};

export default CreateAndUpdateModal;