import axios from 'axios';


const key = 'AIzaSyDI0c6fpWeaxC1d82jjF5Q0gsjA3I6q4ac';

export const search={
    searchStore: term=>axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${term}&language=ko&key=${key}`)
}