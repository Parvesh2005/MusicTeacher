import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const HomePage = () => {
  return (
    <div className="bg-soft-off-white min-h-screen">
      <header className="bg-vibrant-purple text-white text-center relative">
        <Navbar theme="transparent" />
        <div className="container mx-auto px-4 pt-28 pb-32 relative z-10">
          <h2 className="text-5xl font-bold mb-4">Learn Music Live with Real Teachers</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Guitar, Piano, Ukulele, Drums, and more. Find the perfect teacher and start your musical journey today.</p>
          <div className="flex justify-center items-center space-x-4">
            <Link to="/register-student" className="bg-coral-orange text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 text-lg transition-transform transform hover:scale-105">
              Join as a Student
            </Link>
            <Link to="/register-teacher" className="bg-teal-blue text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 text-lg transition-transform transform hover:scale-105">
              Become a Teacher
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none" 
                className="relative block w-[calc(100%+1.3px)] h-[150px]"
            >
                <path 
                    d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                    className="fill-current text-soft-off-white"
                ></path>
            </svg>
        </div>
      </header>
      <section className="py-20">
        <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-teal-blue">How It Works</h3>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Discover talented teachers, book a trial lesson, and start learning from the comfort of your home. Progress tracking and flexible scheduling make it easy to achieve your musical goals.
            </p>
        </div>
      </section>
    </div>
  );
};