
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate, useLoaderData, useRevalidator} from "react-router";
import { NavButton } from "./pages/components/NavButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";
import { LogIn, Home, Trophy, LogOut, User } from "lucide-react";
import { doLogOut } from "./models/users";

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
  const { revalidate } = useRevalidator();
  // const username = "gregoryb79"; // Hardcoded for testing purposes;
  useEffect(() => {
    setLoading(false); // Hide spinner on any route change
  }, [location]);



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
          <NavButton disabled={!username} title="Profile" icon={<User className={styles.lucideIcon} color={!username ? "var(--disabled-gray)":"var(--primary-blue)"} />} ariaLabel="Navigate to Profile Page" onClick={() => {
            setLoading(true);
            navigate("/profile");}}/>
        </li>
        <li>
          <NavButton title="Home" icon={<Home className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Navigate to Home Page" onClick={() => navigate("/")}/>          
        </li>
        <li>
          <NavButton title="Leader Board" icon={<Trophy className={styles.lucideIcon} color="var(--trophy-gold)" />} ariaLabel="Navigate to Leader Board" onClick={() => {
            setLoading(true);
            navigate("/leaderboard");}} />                    
        </li>
        <li>
          {!username && <NavButton title="Log In" icon={<LogIn className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Log In Button" onClick={() => navigate("/login")}/>}
          {username && <NavButton title="Log Out" icon={<LogOut className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Log Out Button" onClick={() => {
              doLogOut();
              revalidate();
              navigate("/login");
            }}/>}
        </li>
      </menu>
    </nav>
  );
}
