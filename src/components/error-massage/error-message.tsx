import { useAppSelector } from '../../store';
import './error-message.css';
import { NameSpace } from '../../const';

function ErrorMessage(): JSX.Element | null {
  const error = useAppSelector((state) => state[NameSpace.Error].error);

  return (error)
    ? <div className='error-message'>{error}</div>
    : null;

}

export default ErrorMessage;
