import { useUser } from '@clerk/clerk-react';
import { OrganizationSwitcher } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { UserProfileButton } from './AuthComponents';

function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Status Page App</Link>
      </div>
      <div className="navbar-menu">
        {isSignedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <div className="org-switcher">
              <OrganizationSwitcher 
                hidePersonal={true}
                appearance={{
                  elements: {
                    rootBox: {
                      width: '200px',
                    },
                  },
                }}
              />
            </div>
            <UserProfileButton />
          </>
        ) : (
          <>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
