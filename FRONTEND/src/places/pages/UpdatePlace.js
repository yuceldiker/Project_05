import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../Shared/components/FormElements/Input';
import Button from '../../Shared/components/FormElements/Button';
import Card from '../../Shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../Shared/util/validators';
import { useForm } from '../../Shared/hooks/form-hook';
import './PlaceForm.css';

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
/* UpdatePlace is a component like the other components(Users, UserPlace etc.) in App.js */
const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          }
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
