import React from 'react'
import './Modal.scss'
const modal = props => (
  <div className="modal">
    <header className="modal__header"><h1>{props.title}</h1></header>
    <section className="modal__content">
      {props.children}
    </section>
    <section className="modal__actions f jce p1">
      { props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button> }
      { props.canConfirm && <button className="btn" onClick={props.onConfirm}>{props.confirmText}</button> }
      { props.canDelete && <button className="btn" onClick={props.onDelete}>Delete Recipe</button> }
    </section>

  </div>
);

export default modal;