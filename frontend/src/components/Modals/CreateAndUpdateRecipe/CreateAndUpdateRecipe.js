import React, { Component } from 'react'
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'

class CreateAndUpdateModal extends Component {
  state = {
    viewing: 'description'
  }
  constructor(props) {
    super(props)
  }
  
  static contextType = AuthContext

  viewHandler = (e) => {
    this.setState({viewing: e.target.id})
  }
  render() {
  return (
    <div className="modal create-update-modal z2">
      <nav className="modal__nav pointer bcbl p0 m0 f" onClick={this.props.onCancel}><p>{`<- Back To Recipes`}</p></nav>
      <header>{this.props.isUpdate ? "Update Recipe" : "Create Recipe"}</header>
      {this.props.validationError && <p className="caps cr">Validation Error: Check your inputs!</p>}
      {this.props.children}
      <div className="modal__header_actions f fdc jce p1">
        {this.props.canConfirm && 
          <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText } </button> }
            {this.props.canSaveChanges && <button className="btn" 
              onClick={this.props.onSaveChanges}>
            {this.props.saveText }  
          </button> 
        }
      </div>
    </div>
    )
  }
};

export default CreateAndUpdateModal;