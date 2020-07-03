import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import { ThemeProvider } from '@material-ui/core';

class ImageEdit extends Component {
  state = {
    isFeaturedImage: false,
    confirmDelete: false,
  }
  constructor(props){
    super(props)
    this.imageEl = React.createRef();
  }


  componentDidMount = () => {
  
    //this.setState({isFeaturedImage: this.props.featuredImage._id === this.props.imageLink._id })
  }
 componentDidUpdate = () => {
  //  console.log('imageLink :', this.props.imageLink)
  //  console.log('this.props.featuredImage: ', this.props.featuredImage)
    if(this.props.featuredImage && this.props.featuredImage._id === this.props.imageLink._id && !this.props.featuredImage && this.props.featuredImage._id === this.props.imageLink._id) {
      this.setState({isFeaturedImage: true})
    }
 }


 setDeleteState = () => {
  //  console.log('reverse state')
   this.setState({confirmDelete: !this.state.confirmDelete})
 }


// openEditStepHandler = async () => {
//   this.state.openStepEditor 
//   ? await this.setState({openStepEditor: false})
//   : await this.setState({openStepEditor: true})
// }

// confirmEditHandler = () => {
//   this.props.updateStepHandler(this.state.originalStepInstruction, {updatedStepInstruction: this.recipeStepEl.current.value, stepNumber: this.props.step.stepNumber})
//   this.setState({openStepEditor: false})
// }

render() {
  return  (
    <div className="uploaded-image f fdc aic rel mr025" data-featured={this.props.featuredImage && this.props.featuredImage._id === this.props.imageLink._id} key={this.props.idx}>
      <div className="delete-image abs right" onClick={this.setDeleteState} >
        {this.state.confirmDelete 
          ? <div className=" f ">
              <div className="confirm-delete pointer clg small soft-btn_hover mr05" onClick={this.props.handleDeleteImage.bind(this, this.props.imageLink._id)}>
                Confirm Delete
              </div> 
              <div className="cancel-delete pointer clg small soft-btn_hover mr05" onClick={this.setDeleteState}>
                <ClearIcon />
              </div>
            </div> 
          : <ClearIcon />}
      </div>
      <div className="image-container f aic">
        <img className="img" ref={this.imageEl} src={this.props.imageLink.link}/>
      </div>
      {this.props.featuredImage && this.props.featuredImage._id === this.props.imageLink._id 
      ?  <div className="featured-label caps small sl2 abs">Featured</div>
      : <div className="featured-image-control f aic">
          <label htmlFor='featured-selection' className="select-featured caps small sl2">Set as featured</label>
          <input type="radio" name="featured-selection" value={this.props.imageLink._id} onChange={this.props.handleFeaturedImage} checked={this.props.featuredImage && this.props.featuredImage._id === this.props.imageLink._id ? true : false }/>
        </div>
      }
  </div> )
}
}


export default ImageEdit 