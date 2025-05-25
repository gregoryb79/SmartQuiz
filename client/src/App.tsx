
import styles from "./App.module.scss";
import { Outlet, useNavigate} from "react-router";
// import { useState } from "react";
import appIcon from "./assets/favicon.png";

export function App() {  

  return (
     <>      
      <Nav/>
      <h1>Welcome to SmartQuiz</h1>
      <Outlet/>
    </>
  );
}

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <section className={styles.logoLine}>
        <img src={appIcon} alt="smart quizz icon" />
        <h3>SmartQuiz</h3>
      </section>
      
      <menu className={styles.navMenu}>
        <li>
          <button onClick={() => navigate("/")}>Home</button>
        </li>
        <li>
          <button onClick={() => navigate("/login")}>History</button>
        </li>
        <li>
          <button onClick={() => navigate("/register")}>Logout</button>
        </li>
      </menu>
    </nav>
  );
}
