import React from 'react'

function Navbar() {
  return (
    <header class="w-full shadow-md bg-white">
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-12 lg:h-14">
          <div class="flex-shrink-0">
            {/* <a href="#" title="" class="flex">
              <img class="w-auto h-8" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/logo.svg" alt="" />
            </a> */}
            <p>PDF Teacher</p>
          </div>

          <div class="lg:flex lg:items-center lg:justify-end lg:space-x-6 sm:ml-auto">
            {/* <a href="/login" title="" class="hidden text-base text-black transition-all duration-200 lg:inline-flex hover:text-opacity-80"> Log in </a> */}

            <a href="/dashboard" title="" class="inline-flex items-center justify-center px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-200 text-black bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg" role="button">Home</a>
          </div>

          <button type="button" class="inline-flex p-2 ml-1 text-black transition-all duration-200 rounded-md sm:ml-4 lg:hidden focus:bg-gray-800 hover:bg-gray-800">

            <svg class="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>

            <svg class="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar