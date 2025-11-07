import { Link } from 'react-router-dom'
import './index.css'
function Header(){

    return(
        <header>
            <nav>
            <Link to="/">Főoldal</Link><br/>
            <Link to="/registration">Regisztráció</Link><br/>
            <Link to="/login">Login</Link><br/>
            </nav>
            
        </header>

    );

}

export default Header