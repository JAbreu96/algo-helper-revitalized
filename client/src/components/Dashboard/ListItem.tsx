interface ItemProps {
  id: number
  title: string
  createdDate: Date
  toggleModal: (id: number) => void
}

export const ListItem: React.FC<ItemProps> = function (props) {
  return (
    <button data-itemid={props.id} onClick={() => props.toggleModal(props.id)}>
      {props.title}
      {props.createdDate.toDateString()}
    </button>
  )
}
