interface DashboardProps {
  lists: Map<string, object[]>
}

export const Dashboard: React.FC<DashboardProps> = function (
  props: DashboardProps
): JSX.Element {
  const { lists } = props
  return (
    <div>
      {new Array(...lists.values()).map((elem, i) => {
        return <p key={i}>{elem.title}</p>
      })}
    </div>
  )
}
