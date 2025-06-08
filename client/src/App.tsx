
import styles from "./App.module.scss";
import { Outlet, useNavigate} from "react-router";
// import { useState } from "react";
import appIcon from "./assets/favicon.png";
import { NavButton } from "./pages/components/NavButton";

export function App() {  

  return (
     <>      
      <Nav/>      
      <Outlet/>
    </>
  );
}

function Nav() {
  const navigate = useNavigate();
  // const {doLogOut} = useDoLogOut(() => navigate("./login"));

  return (
    <nav className={styles.nav}>
      <section className={styles.logoLine}>
        {/* <img src={appIcon} alt="smart quizz icon" /> */}
        <div className={styles.icon}></div>
        <p>SmartQuiz</p>
      </section>
      
      <menu className={styles.navMenu}>
        <li>
          <NavButton label="🏠" ariaLabel="Navigate to Home Page" onClick={() => navigate("/")}/>          
        </li>
        <li>
          <NavButton label="🏆" ariaLabel="Navigate to Leader Board" onClick={() => navigate("/history")} />                    
        </li>
        <li>
          <NavButton label="🔓" ariaLabel="Log out Button"/>
          {/* <NavButton label="LogOut" onClick={doLogOut}/>                               */}
        </li>
      </menu>
    </nav>
  );
}
