import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';

class StepEdit extends Component {
  state = {
    openStepEditor: false,
    originalStepInstruction: this.props.step.stepInstruction
  }
    constructor(props){
      super(props)
      this.recipeStepEl = React.createRef();
    }

componentDidUpdate = () => {
  if(this.props.step.stepInstruction !== this.state.originalStepInstruction) {
    this.setState({originalStepInstruction: this.props.step.stepInstruction})
  }
}


openEditStepHandler = async () => {
  this.state.openStepEditor 
  ? await this.setState({openStepEditor: false})
  : await this.setState({openStepEditor: true})
}



confirmEditHandler = () => {
  this.props.updateStepHandler(this.state.originalStepInstruction, {updatedStepInstruction: this.recipeStepEl.current.value, stepNumber: this.props.step.stepNumber})
  this.setState({openStepEditor: false})
}





render() {
  return (
    <li className="step-list_item f jcb" key={this.props.idx}>
      <div className={`added-step f x jcb ${this.state.openStepEditor ? "hidden" : ""}`}>
        <p><span className="step-order">{this.props.step.stepNumber}.</span> <span className="step-content">{this.props.step.stepInstruction}</span></p>
        <div className="edit-controls f aic jcc">
          <div className="edit-step edit pointer" onClick={this.openEditStepHandler}><p className="s12 clg mx05 my0">edit</p></div>
          <div className="remove-step edit pointer" id={this.props.step.stepNumber} onClick={this.props.removeStepHandler} ><ClearIcon /></div>
        </div>
      </div>

      <div className={`edit-step py1 f x jcb ${this.state.openStepEditor ? "" : "hidden"}`}>
        <div className="section-body">
          <label htmlFor="step-item">Step: </label>

          <input type="text" className="step-content" ref={this.recipeStepEl} id="stepItem" onChange={e => console.log(this.props.recipeStepEl.current.value)} defaultValue={this.props.step.stepInstruction} />
        </div>

        <div className="edit-controls f aic jcc">
          <div className="edit-step edit pointer" onClick={this.confirmEditHandler}><p className="s12 clg mx05 my0">update +</p></div>
          <div className="remove-step edit pointer" id={this.props.step.stepNumber} onClick={this.openEditStepHandler} ><ClearIcon /></div>
        </div>
       
      </div>
  </li> 
  )
}

}

export default StepEdit