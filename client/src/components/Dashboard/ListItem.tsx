interface ItemProps {
  title: string
}

export const ListItem: React.FC<ItemProps> = function (props) {
  return <a href="/dashboard">{props.title}</a>
}
