import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Router'; // ou o caminho certo

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
