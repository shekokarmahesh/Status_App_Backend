import { 
    SignIn, 
    SignUp, 
    UserButton,
    SignedIn,
    SignedOut,
    RedirectToSignIn
  } from '@clerk/clerk-react';
  
  export const SignInPage = () => (
    <div className="auth-container">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
  
  export const SignUpPage = () => (
    <div className="auth-container">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
  
  export const ProtectedRoute = ({ children }) => {
    return (
      <>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  };
  
  export const UserProfileButton = () => <UserButton />;
  