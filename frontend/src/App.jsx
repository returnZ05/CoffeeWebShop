import { Routes, Route } from 'react-router-dom'
import Header from './Header.jsx'
import Registration from './Registration.jsx'
import Home from './Home.jsx'
import Login from './Login.jsx'
import AdminRoute from './AdminRoute.jsx';
import AddProductForm from './AddProductForm.jsx';
import CartPage from './CartPage.jsx';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* 3. EZ AZ ÚJ, LEVÉDETT ÚTVONAL: */}
        <Route 
          path="/admin/add-product" 
          element={
            <AdminRoute> {/* A "Biztonsági Őr" védi... */}
              <AddProductForm /> {/* ...ezt az űrlapot */}
            </AdminRoute>
          } 
        />
        
      </Routes>
    </div>
  );
}

export default App;
