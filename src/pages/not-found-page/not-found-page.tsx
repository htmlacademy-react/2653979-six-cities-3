import { APP_ROUTE } from '../../const';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      404 Not Found <Link to={APP_ROUTE.Root}>Go home</Link>
    </div>
  );
}
export default NotFoundPage;
