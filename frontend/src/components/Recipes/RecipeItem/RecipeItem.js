import React from 'react';
import './RecipeItem.scss'
import testImage from '../../../assets/test-image.jpg'

const recipeItem = props => {
  
  return (
    <li key={props.recipeId} className="recipe__list-item  pointer bcw rel" onClick={props.onDetail.bind(this, props.recipeId)}>
      <div className="overlay abs fill f aic jcc">
        <p className="overlay_text caps ls2 p1">view</p>
      </div>
      <div className="recipe__list-item_inner f fdc jcb x y">
        <div className="recipe__list-item_inner_image f aic jcc">
          <img className="x y" src={testImage}/>
        </div>
        <div className="recipe__list-item_inner_container">
          <h1 className="recipe__list-item_inner_title cdbl">{props.recipeName}</h1>
          <div>
            {props.userId === props.creator._id 
            ? <p className="recipe__list-item_inner_owner cdbl fw5">Your recipe</p>
            : <p className="recipe__list-item_inner_owner cdbl fw5">Saved by {props.creator.email}</p>
            }
         </div>
          
        </div> 
        <h3 className="recipe__list-item_inner_time cdlg">{props.minutesEstimate} {props.minutesEstimate < 2 ? 'min' : 'mins'}</h3>
        
      </div>
    
  </li>
  )

}
  




export default recipeItem;