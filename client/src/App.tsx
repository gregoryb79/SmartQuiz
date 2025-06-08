
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate, useLoaderData} from "react-router";
import { NavButton } from "./pages/components/NavButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";
import { LogIn, Home, Trophy } from "lucide-react";

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
  const username = useLoaderData<string>();
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
          <NavButton icon={<Home className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Navigate to Home Page" onClick={() => navigate("/")}/>          
        </li>
        <li>
          <NavButton icon={<Trophy className={styles.lucideIcon} color="var(--trophy-gold)" />} ariaLabel="Navigate to Leader Board" onClick={() => {
            setLoading(true);
            navigate("/leaderboard");}} />                    
        </li>
        <li>
          <NavButton icon={<LogIn className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Log In Button"/>
          {/* <NavButton label="LogOut" onClick={doLogOut}/>                               */}
        </li>
      </menu>
    </nav>
  );
}
