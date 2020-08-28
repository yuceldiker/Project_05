import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../../places/components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Hidiv Kasrı',
    description: 'Osmanlı İmparatorluğu zamanında Mısır valisinin konağıydı.',
    imageUrl:
      'https://beltur.istanbul/storage/media/albums/6/bgaleri17_1523351310.jpg',
    address: '433G+R6 Anadolu Yakası, İstanbul',
    location: {
      lat: 41.1046269,
      lng: 29.073327
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Anadolu Feneri',
    description:
      'Anadolu Feneri, Boğaz ın Karadeniz e açılan ucunda bulunmaktadır. Bu buruna Yon (Hrom) Burnu denmektedir. Küçük bir tepeciğin üzerinde yer alan Anadolu Feneri, bulunduğu köye de ismini vermiştir.',
    imageUrl:
      'https://www.eliteworldhotels.com.tr/blog/DocumentHandler.ashx?path=~/Resources/CKEditor/Blog/FtDescription/2018-11-09@15-32-03-564_shutterstock_1138301912.jpg',
    address: '6583+HJ Anadolufeneri, Beykoz/İstanbul',
    location: {
      lat: 41.2164433,
      lng: 29.1519092
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
