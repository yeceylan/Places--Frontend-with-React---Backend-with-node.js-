import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

localStorage.getItem('places')

export default function AvailablePlaces({ onSelectPlace }) {

  const [availablePlaces, setAvaliablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    //using async for fecthing
    async function fetchPlaces() {
      setIsFetching(true);

      try {
       const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvaliablePlaces(sortedPlaces);
          setIsFetching(false);
        });

      } catch (error) {
        setError({
          message: error.message || 'Could not fetch places,please try again later.',
        });
        setIsFetching(false);
      }

    }

    fetchPlaces();
    //not async version
    /*fetch('http://localhost:3000/places')
      .then((response) => {
        return response.json()
      }).then((resData) => {
        setAvaliablePlaces(resData.places);
      });*/
  }, []);

  if (error) {
    return <Error title="An error occured!" message={error.message} />;
  }


  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingTect="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
