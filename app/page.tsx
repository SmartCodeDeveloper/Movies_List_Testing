// 1. Import moduls
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Init API key
const API_KEY = '90c95f605d644100846fc86f59c97f0e';

// 1. Init data type
type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
};

type Genre = {
  id: number;
  name: string;
};

type MovieDetails = {
  title: string;
  overview: string;
  release_date: string;
  budget: number;
  backdrop_path: string;
};
//

const Home = () => {
  return (
    <div>Welcome</div>    
  );
};

export default Home;