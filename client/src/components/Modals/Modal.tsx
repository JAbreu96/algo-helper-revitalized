import { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode[]
}
//TODO:Handle user click outside of modal
export const Modal: React.FC<ModalProps> = function (props) {
  return (
    <div className="modal">
      <div className="modal-container">
        <h1>THIS IS A MODAL</h1>
        {props.children}
      </div>
    </div>
  )
}
