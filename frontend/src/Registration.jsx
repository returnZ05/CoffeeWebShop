import './index.css'
function Registration(){
    return(
        <div class='userForm'>
        <h1>Regisztráció</h1>
        <form >
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" placeholder="username"/>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" placeholder="password" />
            <label htmlFor="email">Email: </label>
            <input type="email" name="email" id="email" placeholder="johndoe@gmail.com"/>
            <label htmlFor="aszf">Elfogadom az ASZF-et.</label>
            <input type="checkbox" name="aszf" id="aszf" required/>
            <button id='regBtn'>Regisztálás</button>
        </form>
        </div>
    );
}

export default Registration