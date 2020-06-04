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
  console.log('this.props.confirmText: ', this.props.confirmText)
  return (
    <div className="modal">
    <header className="modal__header"><h1>{this.props.title}</h1></header>
    <section className="modal__content">
      {this.props.children}
    </section>
    <section className="modal__actions f jce p1">
      
      { this.props.canCancel && <button className="btn" onClick={this.props.onCancel}>Cancel</button> }
      { this.props.canConfirm && 
      <button className="btn" 
      onClick={this.context.userId !== this.props.creator_id ? this.props.onConfirm : this.props.onDelete}>
        {this.context.userId !== this.props.creator_id ? this.props.confirmText : this.props.deleteText}
      </button> 
      }
      {this.props.canEdit && 
      <button className="btn" onClick={this.props.onEdit}>Edit Recipe</button>
      }
    </section>

  </div>
  )
  }

  
 
  };

export default Modal;