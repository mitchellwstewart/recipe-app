import React, { Component } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import '../Modals.scss'
import AuthContext from '../../../context/auth-context'

class CreateAndUpdateModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewing: 'description'
    }
  }
  
  static contextType = AuthContext

  componentDidMount() {
    document.querySelector('.main-content').classList.add('lock')
   }
  viewHandler = (e) => {
    this.setState({viewing: e.target.id})
  }
  
  render() {
  return (
    <div className="modal create-update-modal z2">
      <nav className="modal__nav  bcbl p0 m0 f jcb aic z3" >
      
      <header className="modal__header f jcb s12 ls1 clg caps f fw6 aic">{this.props.isUpdate ? "Updating Recipe" : "Creating Recipe"}</header>
        <div className="p05 f aic pointer"  onClick={this.props.onCancel}>
        <ClearIcon/></div>
        </nav>
      
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