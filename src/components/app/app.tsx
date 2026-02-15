import MainPage from '../../pages/main-page/main-page';

type AppProps = {
  cartView: number;
  offerCount: number;
  cities: string[];
}

function App({cartView, offerCount, cities}: AppProps): JSX.Element{
  return (
    <MainPage cartView={cartView} offerCount={offerCount} cities={cities}/>
  );
}

export default App;
