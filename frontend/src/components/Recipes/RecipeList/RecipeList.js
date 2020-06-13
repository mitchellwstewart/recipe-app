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
     recipeImage = {recipe.imageLink}
      creator = {recipe.creator}
      minutesEstimate = {recipe.minutesEstimate}
      date = {recipe.date}
      onDetail={props.onViewDetail}
    />
  })
  return (
  <ul className="recipe__list f jcs fw">
  {recipes}
  </ul>
  )
  
}

export default recipeList;
