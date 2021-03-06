import React from 'react'
import './RecipeList.scss'
import RecipeItem from '../RecipeItem/RecipeItem'

const recipeList = props => {
  const recipes = props.recipes.map(recipe => {
    return <RecipeItem 
    userId={props.authUserId} 
    key={recipe._id}
    recipeId={recipe._id} 
    recipeName={recipe.recipeName}
    recipeImage = {recipe.imageLinks.find(image => image.featured)}
    creator = {recipe.creator}
    minutesEstimate = {recipe.minutesEstimate}
    date = {recipe.date}
    onDetail={props.onViewDetail}
    />
  })
  return (
  <ul className="recipe__list f jcb fw">
  {recipes}
  <li className="recipe__list-item  spacer rel"></li>

  </ul>
  )
  
}

export default recipeList;
