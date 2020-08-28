import React from 'react';

import UserItem from './UserItem';
import Card from '../../Shared/components/UIElements/Card';
import './UsersList.css';

const UsersList = props => {
  if (props.item.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.item.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );


};

export default UsersList;