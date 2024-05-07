import { List } from 'components/Dashboard/List'
import { ListObject } from 'types/project_types'

interface DashboardProps {
  lists: Map<string, ListObject>
}

export const Dashboard: React.FC<DashboardProps> = function (
  props: DashboardProps
): JSX.Element {
  const { lists } = props
  return (
    <div>
      {new Array(...lists.values()).map((elem, i) => {
        return (
          <List key={elem.title} listTitle={elem.title}>
            {elem.cards.map((list) => {
              return <p key={list.title}>Card</p>
            })}
          </List>
        )
      })}
    </div>
  )
}
