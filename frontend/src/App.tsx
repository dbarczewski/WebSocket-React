import { useState } from 'react';
import UserLogin from './UserLogin';
import Header from './Header';
import BuyTable from './BuyTable';

function App() {
  const [user, setUser] = useState<any>(null);

  const handleSaveUser = (user: any) => {
    setUser(user);
  };

  const renderMain = () => {
    return user ? (
      <BuyTable user={user} />
    ) : (
      <UserLogin handleSave={handleSaveUser} />
    );
  };

  return (
    <div>
      <Header username={user} />
      {renderMain()}
    </div>
  );
}

export default App;
