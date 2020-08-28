import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
      {
        id: 'u1',
        name: 'Yücel Diker',
        image: 'https://i.udemycdn.com/user/200_H/10227270_dc0e.jpg',
        places: 3
      },
      {
        id: 'u2',
        name: 'Leyla Yıldız Diker',
        image:
          'https://www.ozyegin.edu.tr/sites/default/files/styles/akademikkadrodetay/public/img_8625_0.jpg?itok=FoW_BgEL',
        places: 5
      }
    ];
    
    return <UsersList item={USERS} />;
};

export default Users;