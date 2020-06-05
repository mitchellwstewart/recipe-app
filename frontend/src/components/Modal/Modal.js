import React, { Component } from 'react'
import './Modal.scss'
import AuthContext from '../../context/auth-context'



class Modal extends Component {

  constructor(props) {
    super(props)
  }
  
  static contextType = AuthContext
  render() {
    console.log(this.props)
  return (
    <div className="modal">
    <header className="modal__header"><h1>{this.props.title}</h1></header>
    <section className="modal__content">
      {this.props.children}
    </section>
    <section className="modal__actions f jce p1">
      
      { this.props.canCancel && <button className="btn" onClick={this.props.onCancel}>Cancel</button> }
      {this.props.canConfirm && <button className="btn" onClick={this.props.onConfirm}> {this.props.confirmText } </button> }
      {this.props.canSubscribe && 
        <button className="btn" 
      onClick={this.props.onSubscribe }>
        { this.props.subscribeText }
      </button> 
    }
      {this.props.canDelete && <button className="btn" 
      onClick={this.props.onDelete}>
        { this.props.deleteText }
      </button> }
      {this.props.canEdit && 
      <button className="btn" onClick={this.props.onEdit}>{this.props.editText}</button>
      }
       {this.props.canSaveChanges && <button className="btn" 
      onClick={this.props.onSaveChanges}>
        {this.props.saveText }
      </button> }
    </section>

  </div>
  )
  }

  
 
  };

export default Modal;