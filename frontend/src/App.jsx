import { Routes, Route } from 'react-router-dom'
import Header from './Header.jsx'
import Registration from './Registration.jsx'
import Home from './Home.jsx'
import Login from './Login.jsx'
import AdminRoute from './AdminRoute.jsx';
import AddProductForm from './AddProductForm.jsx';
import CartPage from './CartPage.jsx';
import CheckoutSuccess from './CheckoutSuccess.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import OrderHistoryPage from './OrderHistoryPage.jsx';
import EditProductForm from './EditProductForm.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import UserProfilePage from './UserProfilePage.jsx'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess/>} />
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <OrderHistoryPage/>
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      
        <Route 
          path="/admin/add-product" 
          element={
            <AdminRoute>
              <AddProductForm/>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/add-product" 
          element={
          <AdminRoute>
            <AddProductForm/>
          </AdminRoute>} 
        />
        <Route 
          path="/admin/edit-product/:id" 
          element={
          <AdminRoute>
            <EditProductForm/>
          </AdminRoute>} 
        />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
}         />
        
      </Routes>
    </div>
  );
}

export default App;
