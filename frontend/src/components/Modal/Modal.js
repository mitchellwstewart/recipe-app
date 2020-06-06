import React, { Component } from 'react'
import './Modal.scss'
import AuthContext from '../../context/auth-context'



class Modal extends Component {
  state = {
    viewing: 'description'
  }
  constructor(props) {
    super(props)
  }
  
  static contextType = AuthContext

  viewHandler = (e) => {
    console.log(e.target)
    this.setState({viewing: e.target.id})
  }
  render() {
    console.log("SELECTED:",this.props.selectedRecipe)
    const recipeName = this.props.selectedRecipe.recipeName
    const description = this.props.selectedRecipe.recipeDescription
    const ingredients = this.props.selectedRecipe.recipeIngredients
    const steps = this.props.selectedRecipe.recipeSteps
    const estimateTime = this.props.selectedRecipe.minutesEstimate
    const dateAdded = new Date(this.props.selectedRecipe.date).toLocaleDateString()
    const recipeLink = this.props.selectedRecipe.link
    
  return (
    <div className="modal z2">
    <nav className="modal__nav pointer bcbl p0 m0 f" onClick={this.props.onCancel}><p>{`<- Back To Recipes`}</p></nav>
    <header className="modal__header f jcb">
      <h1>{recipeName}</h1>
      <p>Time: {estimateTime} {estimateTime > 1 ? " mins" : ' min'}</p>
      <section className="modal__header_actions f fdc jce p1">
      {recipeLink && 
        <a href={recipeLink} target="_blank">{`View Original Recipe`}</a>
      }
      {this.props.canConfirm && <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText } </button> }
      {this.props.canSubscribe && 
        <button className="btn" 
      onClick={this.props.onSubscribe }>
        { this.props.subscribeText }
      </button> 
    }
      {this.props.canDelete && <button className="btn" 
      onClick={this.props.onDelete}>
        { this.props.deleteText }
      </button> }
      {this.props.canEdit && 
      <button className="btn" onClick={this.props.onEdit}>{this.props.editText}</button>
      }
       {this.props.canSaveChanges && <button className="btn" 
      onClick={this.props.onSaveChanges}>
        {this.props.saveText }
      </button> }
    </section>
      </header>
    <section className="modal__content f">
      <ul className="modal__content_ingredients-nav f fdc">
        <div className="yield-count">
          Yields: 
          <input className="yield-count_amount" type="text" defaultValue="4"/>
        </div>
        {ingredients.split("-").map((ingredient, idx) => {
          console.log('ingredient: ', ingredient)
          return ingredient !== " " && (
          <li key={idx} className="ingredient-container f aic">
            <p className="ingredient-container_amount" >1 </p>
            - 
          <p> {ingredient}</p>
          </li>
          )
        })}
      </ul>
      <div className="modal__content_main f fdc">
        <ul className="modal__content_main_nav f jcb pl0">
          <li className={`modal__content_main_nav_item pointer mr1 ${this.state.viewing === "description" ? "active" : ""}`} id="description" onClick={this.viewHandler}>Description</li>
          <li className={`modal__content_main_nav_item pointer mr1 ${this.state.viewing === "steps" ? "active" : ""}`} id="steps" onClick={this.viewHandler}>Steps</li>
          <li className={`modal__content_main_nav_item pointer mr1 ${this.state.viewing === "creator-notes" ? "active" : ""}`} id="creator-notes" onClick={this.viewHandler}>Creator Notes</li>
        </ul>
        {this.state.viewing === "description" && <p>{description}</p>}
        {this.state.viewing === "steps" && <p>{steps}</p>}
        {this.state.viewing === "creator-notes" && <p>{dateAdded}</p>}
      </div>
      
      
    </section>
    

  </div>
  )
  }

  
 
  };

export default Modal;