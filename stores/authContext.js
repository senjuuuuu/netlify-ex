import { createContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
});
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    //Login
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
      console.log('login event');
    });

    //Logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
      console.log('logout event');
    });

    //init
    netlifyIdentity.on('init', (user) => {
      setUser(user);
      setAuthReady(true);
    });
    //init netlify identity context
    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  //Fnc login context
  const login = () => {
    netlifyIdentity.open();
  };

  //Fnc lgout context
  const logout = () => {
    netlifyIdentity.logout();
  };

  //VALUE CONTEXT
  const context = { user, login, logout };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
