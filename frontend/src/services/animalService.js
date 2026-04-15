import { API_URL } from './api';

// Fetch all animals from the database
export const getAnimals = async () => {
  const response = await fetch(`${API_URL}/animals`);
  if (!response.ok) {
    throw new Error('Failed to fetch animals');
  }
  return await response.json();
};

// Add a new animal to the database
export const addAnimal = async (animalData) => {
  const response = await fetch(`${API_URL}/animals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(animalData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add animal');
  }
  return await response.json();
};