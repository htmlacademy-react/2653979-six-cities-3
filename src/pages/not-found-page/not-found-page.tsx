import { APP_ROUTE } from '../../const';
import { Helmet } from 'react-helmet-async';
function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      404 Not Found <a href={APP_ROUTE.Root}>Go home</a>
    </div>
  );
}
export default NotFoundPage;
