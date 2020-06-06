import React from 'react'


const inputForm = (props) => {
  
  
  console.log('input form props: ', props.onDrop)
  return (
  <form encType="multipart/form-data">
      <div className="form-control">
        <label htmlFor="recipeName">Recipe Name</label>
        <input ref={props.recipeNameEl} type="text" id="recipeName" defaultValue={props.recipeNameValue ? props.recipeNameValue : ""}/>
      </div>
      <div className="form-control">
        <label htmlFor="recipeDescription">Recipe Description</label>
        <textarea ref={props.recipeDescriptionEl} type="text" id="recipeDescription" rows="4" defaultValue={props.recipeDescriptionValue ? props.recipeDescriptionValue : ""}/>
      </div>
      <div className="form-control">
        <label htmlFor="recipeIngredients">Recipe Ingredients</label>
        <textarea ref={props.recipeIngredientsEl} type="text" id="recipeIngredients"  rows="4" defaultValue={props.recipeIngredientsValue ? props.recipeIngredientsValue : ""}/>
      </div>
      <div className="form-control">
        <label htmlFor="recipeSteps">Recipe Steps</label>
        <textarea ref={props.recipeStepsEl} type="text" id="recipeSteps" rows="4" defaultValue={props.recipeStepsValue ? props.recipeStepsValue : ""}/>
      </div>
      <div className="form-control">
        <label htmlFor="minutesEstimate">Estimated Minutes</label>
        <input ref={props.minutesEstimateEl} type="number" id="minutesEstimate" defaultValue={props.minutesEstimateValue ? props.minutesEstimateValue : ""} />
      </div>
      <div className="form-control">
        <label htmlFor="recipeLink">Recipe Link</label>
        <input ref={props.linkEl} type="url" id="recipeLink" defaultValue={props.linkValue ? props.linkValue : ""} />
      </div>
      <div className="form-control">
       <label>Upload your image</label>
       <input type="file" name="Recipe Image" id="recipeImage" />
      </div>
      <div className="form-control">
      <label htmlFor="imageUpload">Use Link Image (first image found)</label>
      <input ref={props.useLinkImageEl} type="checkbox" id="useLinkImage" defaultChecked={props.useLinkImage ? true : false} />
        
      </div>
    </form>
  )
    
}

export default inputForm;