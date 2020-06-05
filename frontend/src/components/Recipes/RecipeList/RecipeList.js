import React from 'react'
import './RecipeList.scss'
import RecipeItem from '../RecipeItem/RecipeItem'

const recipeList = props => {
  const recipes = props.recipes.map(recipe => {
    console.log('creator id : ', recipe.creator._id)
    console.log('props user: ', props.authUserId)
    return <RecipeItem 
    userId={props.authUserId} 
    key={recipe._id}
     recipeId={recipe._id} 
     recipeName={recipe.recipeName}
      creatorId = {recipe.creator._id}
      minutesEstimate = {recipe.minutesEstimate}
      date = {recipe.date}
      onDetail={props.onViewDetail}
    />
  })
  return (
  <ul className="recipe__list">
  {recipes}
  </ul>
  )
  
}

export default recipeList;
