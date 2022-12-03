// import logo from './logo.svg';
import './App.css';
import Header from './Components/Header'
import SideNav from './Components/SideNav';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import  Home from './Pages/Home';
import  AddReviews from './Pages/AddReviews';
import  ViewReviews  from './Pages/ViewReviews';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter> 
      <SideNav />
      <div className="sideswitch">
      <div style={{paddingLeft:205}} ></div>
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/addreviews' element={<AddReviews />} />
      <Route path='/viewreviews' element={<ViewReviews />} /> 
      </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
