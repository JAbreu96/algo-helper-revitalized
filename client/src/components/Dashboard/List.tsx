import { ReactNode } from 'react'

interface ListProps {
  mapKey: string
  listTitle: string | undefined
  children: Array<ReactNode> | undefined
  addCardHandler: (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: string
  ) => void
}

export const List: React.FC<ListProps> = function (props) {
  return (
    <div className="list">
      <p className="list--title">{props.listTitle}</p>
      <button
        className="list--addBtn"
        onClick={(ev) => {
          props.addCardHandler(ev, props.mapKey)
        }}
      >
        +
      </button>
      {props.children}
    </div>
  )
}
