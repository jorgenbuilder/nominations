import { Redirect } from 'react-router'
import routes from '../routes'

const IndexPage:React.FC = () => {
    return <Redirect to={routes.roundList.path} />
}

export default IndexPage;