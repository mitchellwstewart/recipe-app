import React, { Component } from 'react'
import { ReactTinyLink } from 'react-tiny-link'
import '../Modals.scss'
import '../../../styles/lib/_display.scss'
import AuthContext from '../../../context/auth-context'
import Ingredients from '../Ingredients/Ingredients'

class ViewModal extends Component {
  state = {
    viewing: 'description',
    badLink: false
  }
  constructor(props) {
    super(props)
  }

  static contextType = AuthContext

  viewHandler = (e) => {
    this.setState({ viewing: e.target.id })
  }

  render() {
    console.log('this.props.selected: ', this.props.selectedRecipe)
    const recipeName = this.props.selectedRecipe.recipeName
    const description = this.props.selectedRecipe.recipeDescription
    const ingredients = this.props.selectedRecipe.recipeIngredients
    const steps = this.props.selectedRecipe.recipeSteps
    const estimateTime = this.props.selectedRecipe.minutesEstimate
    const recipeLink = this.props.selectedRecipe.link
    const recipeImages = this.props.selectedRecipe.imageLinks
    return (
      <div className="modal z2">
        <nav className="modal__nav pointer bcbl p0 m0 f" onClick={this.props.onCancel}><p>{`<- Back To Recipes`}</p></nav>
        <header className="modal__header f jcb">
          <div className="f fdc">
            <h1>{recipeName}</h1>
            <p>Time: {estimateTime} {estimateTime > 1 ? " mins" : ' min'}</p>
            <div className="tag-container">
             <p className="fw6"> Tags: </p>
              <div className="tag-list f">
              {this.props.selectedRecipe.tags.map(tag => <div className="recipe-tag pr05" key={tag.tag}>{tag.tag}</div>)}
              </div>
            </div>
          </div>

          <section className="modal__header_actions f fdc jce p1">
            {this.props.canConfirm && <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText} </button>}
            {/* {this.props.canSubscribe &&
              <button className="btn"
                onClick={this.props.onSubscribe}>
                {this.props.subscribeText}
              </button>
            } */}
            {this.props.canDelete && <button className="btn"
              onClick={this.props.onDelete}>
              {this.props.deleteText}
            </button>}
            {this.props.canEdit &&
              <button className="btn" onClick={this.props.onEdit}>{this.props.editText}</button>
            }
            {this.props.canSaveChanges && <button className="btn"
              onClick={this.props.onSaveChanges}>
              {this.props.saveText}
            </button>}
          </section>
        </header>
        <section className="modal__content f">
          {/* Ingredients */}
          <div className="desktop-only"> 
          <header className="modal__content_ingredients_header fw5">Ingredients</header>
            <Ingredients  ingredients = {ingredients} selectedRecipe={this.props.selectedRecipe}/>
         </div>

          {/* Main Content */}
          <div className="modal__content_main f fdc">

            <ul className="modal__content_main_nav f jcs pl0">
              <li className={`modal__content_main_nav_item pointer mr1 fw5 ${this.state.viewing === "description" ? "active" : ""}`} id="description" onClick={this.viewHandler}>Description</li>
              <li className={`modal__content_main_nav_item pointer mr1 fw5 ${this.state.viewing === "steps" ? "active" : ""}`} id="steps" onClick={this.viewHandler}>Steps</li>
              <li className={`modal__content_main_nav_item pointer mr1 fw5 mobile-only ${this.state.viewing === "ingredients" ? "active" : ""}`} id="ingredients" onClick={this.viewHandler}>Ingredients</li>
              
              {/* <li className={`modal__content_main_nav_item pointer mr1 fw5 ${this.state.viewing === "creator-notes" ? "active" : ""}`} id="creator-notes" onClick={this.viewHandler}>Creator Notes</li> */}
            </ul>
            {this.state.viewing === "description" && 
            <div>
                <p>{description}</p>
                {recipeImages && recipeImages.length
                ?
                <div className="m1r">
                    <p>recipe images</p>
                    {recipeImages.map((imageLink, idx) => {
                      return (<img key={idx} className="uploaded-image" src={imageLink} />)
                    })}
                  </div>  
                : <div> NO IMAGE AVAILABLE</div>}
                {recipeLink && !this.state.badLink &&
                // <a href={recipeLink} target="_blank">{`View Original Recipe`}</a>
                <React.Fragment>
                  <p className="fw6">Original Recipe:</p>
                  <div  className="container--5">
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic={true}
                      maxLine={2}
                      minLine={1}
                      url={recipeLink.includes('http') ? recipeLink : `https://${recipeLink}`}
                      onError={() => this.setState({badLink: true})}
                    />
                  </div>
                </React.Fragment>
                }
            </div>
            }
            {this.state.viewing === "steps" && (
              
              <div className="steps-container m1r">
                
              {steps.map(step => {
                return <p key={step.stepNumber}>{step.stepNumber}. {step.stepInstruction}</p>
              })}
              </div>)
            }
            {this.state.viewing === "ingredients" && <div className="mobile-only"><Ingredients className="mobile-only" ingredients = {ingredients} selectedRecipe={this.props.selectedRecipe}/></div>}
            {/* {this.state.viewing === "creator-notes" && <p>{dateAdded}</p>} */}
          </div>
        </section>
      </div>
    )
  }
};

export default ViewModal;