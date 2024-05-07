import { ReactNode } from 'react'

interface ListProps {
  listTitle: string
  children: Array<ReactNode>
}

export const List: React.FC<ListProps> = function (props) {
  return (
    <div>
      <p>{props.listTitle}</p>
      {props.children}
    </div>
  )
}
