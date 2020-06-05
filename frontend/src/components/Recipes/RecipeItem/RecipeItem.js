import React from 'react';
import './RecipeItem.scss'

const recipeItem = props => {
  console.log(props)
  return (
    <li key={props.recipeId} className="recipe__list-item f jcb pointer" onClick={props.onDetail.bind(this, props.recipeId)}>
    <div className="recipe__list-item_image">

    </div>
    <div className="recipe__list-item_container">
      <h1 className="recipe__list-item_title">{props.recipeName}</h1>
      <h3 className="recipe__list-item_time">{props.minutesEstimate} mins</h3>
      <h3 >Date Added: {new Date(props.date).toLocaleDateString()}</h3>
    </div> 
    <div>
      {props.userId === props.creator._id 
      ? <p className="recipe__list-item_owner">Your the owner of this recipe</p>
      : <p className="recipe__list-item_owner">Saved by {props.creator.email}</p>
      }
    </div>
  </li>
  )

}
  




export default recipeItem;