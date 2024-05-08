interface ItemProps {
  id: number
  title: string
  createdDate: Date
  toggleModal: (id: number) => void
}

export const ListItem: React.FC<ItemProps> = function (props) {
  return (
    <button
      className="listItem"
      data-itemid={props.id}
      onClick={() => props.toggleModal(props.id)}
    >
      <p className="listItem__title">{props.title}</p>
      <p className="listItem__date">{props.createdDate.toDateString()}</p>
    </button>
  )
}
