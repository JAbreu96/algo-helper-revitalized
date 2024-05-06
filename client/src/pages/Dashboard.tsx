interface DashboardProps {
  lists: Map<string, Array<object>>
}

export const Dashboard: React.FC<DashboardProps> = function (
  props: DashboardProps
): JSX.Element {
  const { lists } = props
  return (
    <div>
      {lists.get('todo')?.map((elem, i) => {
        return <p key={i}>{i}</p>
      })}
    </div>
  )
}
