import './spinner.css';

function Spinner(): JSX.Element {
  return (
    <div className="spinner-container" data-testid="spinner">
      <div className="spinner" />
    </div>
  );
}

export default Spinner;
