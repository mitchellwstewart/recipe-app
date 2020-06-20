import React, { Component } from 'react'
import { ReactTinyLink } from 'react-tiny-link'
import Flickity from 'react-flickity-component'

import ClearIcon from '@material-ui/icons/Clear';
import '../Modals.scss'
import '../../../styles/lib/_display.scss'
import AuthContext from '../../../context/auth-context'
import Ingredients from '../Ingredients/Ingredients'

class ViewModal extends Component {
  state = {
    viewing: 'description',
    badLink: false,
    confirmDelete: false,
    fullscreenView: false
  }
  constructor(props) {
    super(props)
    this.flkty = React.createRef();
    this.imagesSection = React.createRef();
    
  }
  flickityOptions = {
    groupCells: 1,
    percentPosition: true,
    prevNextButtons: false,
    wrapAround: true,
    contain: true,
    on: {
      ready: function() {
        console.log('Flickity is ready');
      },
      change: function( index ) {
        console.log( 'Slide changed to ' + index );
      }
    }
  }

  static contextType = AuthContext
  componentDidMount = () => {
    console.log('flickity ref: ', this.flkty)
  }
  
  componentDidUpdate() {
    console.log('resize')
    this.flkty.resize()
  }

  viewHandler = (e) => {
    this.setState({ viewing: e.target.id })
  }

  deleteHandler = e => {
    this.setState({confirmDelete: !this.state.confirmDelete})
  }

  fullscreenHandler = e => {
    console.log('e.target: ', e.target)
    console.log('this.flkty: ', this.flkty)
    console.log('this.imagesSection: ', this.imagesSection)
    if(this.state.fullscreenView){
      this.flkty.resize()
      //this.setState({fullscreenView: !this.state.fullscreenView})
    }
    else {
      this.flkty.resize()
      this.setState({fullscreenView: !this.state.fullscreenView})
    }
  }

  closeFullscreen = () => {
    this.setState({fullscreenView: false})
  }
  


  

  render() {
    console.log('this.flickityOptions: ', this.flickityOptions)
    const recipeName = this.props.selectedRecipe.recipeName
    const description = this.props.selectedRecipe.recipeDescription
    const ingredients = this.props.selectedRecipe.recipeIngredients
    const steps = this.props.selectedRecipe.recipeSteps
    const estimateTime = this.props.selectedRecipe.minutesEstimate
    const recipeLink = this.props.selectedRecipe.link
    const recipeImages = this.props.selectedRecipe.imageLinks
    return (
      <div className="modal z2">
        <nav className="modal__nav pointer bcbl p0 m0 f jcb" >
        <section className="modal__header_actions f jce">
            {/* {this.props.canConfirm && <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText} </button>} */}
            {/* {this.props.canSubscribe &&
              <button className="btn"
                onClick={this.props.onSubscribe}>
                {this.props.subscribeText}
              </button>
            } */}
            {this.props.canEdit &&
              <div className="action-container edit-action">
                <button className="soft-btn soft-btn_hover f aic" onClick={this.props.onEdit}>{this.props.editText}</button>
              </div>
            }
            {this.props.canDelete && 
              <div className="action-container delete-actions f aic">
              <div className="f">
              {this.state.confirmDelete 
                ? <React.Fragment>
                  <div className="confirm-delete soft-btn soft-btn_hover" onClick={this.props.onDelete}>Confirm Delete</div>
                  <div className="cancel-delete" onClick={this.deleteHandler}><ClearIcon /></div>
                </React.Fragment>
                : <div className="soft-btn soft-btn_hover" onClick={this.deleteHandler}>{this.  props.deleteText}</div>}
                  </div> 


            </div>}
            {this.props.canSaveChanges && <button className="soft-btn soft-btn_hover"
              onClick={this.props.onSaveChanges}>
              {this.props.saveText}
            </button>}
          </section>
          <div className="py05 f aic " onClick={this.props.onCancel}><ClearIcon /></div>
        </nav>
        <header className="modal__header main f jcb ">
          <div className="f fdc x2 jcc">
            <h1 className="suiz">{recipeName}</h1>
            <p>Time: {estimateTime} {estimateTime > 1 ? " mins" : ' min'}</p>
            {this.props.selectedRecipe.tags.length > 0 && 
            <div className="tag-container">
             <p className="fw6"> Tags: </p>
              <div className="tag-list f">
              {this.props.selectedRecipe.tags.map(tag => <div className="recipe-tag pr05" key={tag.tag}>{tag.tag}</div>)}
              </div>
            </div>
            }
          </div>
          <div className="featured-image">
            <img className="main-image" src={this.props.selectedRecipe.imageLinks.find(img => img.featured).link} />
          </div>
        </header>
        <section className="modal__content px1 f">
          {/* Ingredients */}
          <div className="desktop-only modal__content_ingredients"> 
            <header className="modal__content_ingredients_header fw5 robo caps fw7 ls1">Ingredients</header>
            <Ingredients ingredients = {ingredients} selectedRecipe={this.props.selectedRecipe}/>
         </div>

          {/* Main Content */}
          <div className="modal__content_main f fdc pl1 x">
            <ul className="modal__content_main_nav f jcs pl0">
              <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps ${this.state.viewing === "description" ? "active" : ""}`} id="description" onClick={this.viewHandler}>Description</li>
              <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps ${this.state.viewing === "steps" ? "active" : ""}`} id="steps" onClick={this.viewHandler}>Steps</li>
              <li className={`modal__content_main_nav_item pointer mr1 fw5 s12 fw7 ls1 caps mobile-only ${this.state.viewing === "ingredients" ? "active" : ""}`} id="ingredients" onClick={this.viewHandler}>Ingredients</li>
              {/* <li className={`modal__content_main_nav_item pointer mr1 fw5 ${this.state.viewing === "creator-notes" ? "active" : ""}`} id="creator-notes" onClick={this.viewHandler}>Creator Notes</li> */}
            </ul>
            {this.state.viewing === "description" && 
            <div>
                <section className="section-body description">
                  <p className="caps ls1 fw6">Overview</p>
                  <p>{description}</p>
                </section>

                
                {recipeImages && recipeImages.length
                && <section className={`section-body images f x fdc ${this.state.fullscreenView ? 'fullscreen fill bccr' : ''}`} ref={this.imagesSection}>
                  <div className={`close-fullscreen f jce p1 ${this.state.fullscreenView ? '' : 'hidden'}`} onClick={this.closeFullscreen}><ClearIcon/></div>
                  {!this.state.fullscreenView && <p className="caps ls1 fw6">Photos</p> }
                      <Flickity
                        className={'recipe-images view f fw x y aic'} // default ''
                        elementType={'div'} // default 'div'
                        options={this.flickityOptions} // takes flickity options {}
                        disableImagesLoaded={false} // default false
                        reloadOnUpdate ={true}// default false
                        static={false} // default false
                        flickityRef={c => this.flkty = c}
                      >
                    {recipeImages.map((image, idx) => {
                      return (
                        <div key={idx} className="image-container mr05" onClick={this.fullscreenHandler}>
                          <img  className="uploaded-image" src={image.link} />
                        </div>
                      )
                    })}
                    </Flickity>
                  </section> 
                }
                {recipeLink && !this.state.badLink &&
                // <a href={recipeLink} target="_blank">{`View Original Recipe`}</a>
                <React.Fragment>
                  <p className="caps ls1 fw6">Original Recipe:</p>
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
              
              <div className="steps-container mr1">
                
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