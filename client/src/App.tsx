
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate} from "react-router";
import { NavButton } from "./pages/components/NavButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";

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
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
   useEffect(() => {
    setLoading(false); // Hide spinner on any route change
  }, [location]);
  // const {doLogOut} = useDoLogOut(() => navigate("./login"));

  return (    
    <nav className={styles.nav}>
      {loading && <Spinner/>} 
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
          <NavButton label="🏆" ariaLabel="Navigate to Leader Board" onClick={() => {
            setLoading(true);
            navigate("/leaderboard");}} />                    
        </li>
        <li>
          <NavButton label="🔓" ariaLabel="Log out Button"/>
          {/* <NavButton label="LogOut" onClick={doLogOut}/>                               */}
        </li>
      </menu>
    </nav>
  );
}
