import { Routes, Route } from 'react-router-dom'
import Header from './Header.jsx'
import Registration from './Registration.jsx'
import Home from './Home.jsx'
import Login from './Login.jsx'

function App() {
  return(
    <div>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/registration" element={<Registration/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </div>
  );
}

export default App
