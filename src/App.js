import './App.css';
import {BrowserRouter, Routes , Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'
import EditorPage from './pages/EditorPage';
function App() {
  return (
    <>
    <div>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    </div> 
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Editor/:roomID' element={<EditorPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
