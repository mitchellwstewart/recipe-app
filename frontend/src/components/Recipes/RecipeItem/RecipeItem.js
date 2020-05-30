import React from 'react';
import './RecipeItem.scss'

const recipeItem = props => {
  return (
    <li key={props.recipeId} className="recipe__list-item f jcb">
    <div>
      <h1>{props.recipeName}</h1>
      <h3>Estimated Time: {props.minutesEstimate} mins</h3>
      <h3>Date Added: {new Date(props.date).toLocaleDateString()}</h3>
    </div> 
    <div>
      {props.userId === props.creatorId 
      ? <p>Your the owner of this recipe</p>
      : <button className="btn" onClick={props.onDetail.bind(this, props.recipeId)}>View Details</button>
      }
    </div>
  </li>
  )

}
  




export default recipeItem;