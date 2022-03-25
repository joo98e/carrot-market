import type { NextPage } from "next";

 const Upload: NextPage = () => {
   return (
     <div className="px-4 py-16">
         <div>
           <label className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md text-gray-300 hover:text-orange-500 hover:border-orange-500 cursor-pointer">
             <svg
               className="h-12 w-12"
               stroke="currentColor"
               fill="none"
               viewBox="0 0 48 48"
               aria-hidden="true"
             >
               <path
                 d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                 strokeWidth={2}
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
             </svg>
             <input className="hidden" type="file" />
           </label>
         </div>
       <div className="my-5">
         <label className="mb-1 block text-sm font-medium text-gray-500" htmlFor="price">Price</label>
         <div className="rounded-md shadow-sm relative flex items-center">
           <div className="pointer-events-none absolute pl-3 left-0 flex items-center justify-center">
             <span>$</span>
           </div>
           <input id="price" type="text" placeholder="0.00" className="appearance-none pl-7 w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
           <div className="pointer-events-none absolute right-0 pr-3 flex items-center">
             <span className="text-gray-500">USD</span>
           </div>
         </div>
       </div>
       <div>
         <label className="mb-1 block text-sm font-medium text-gray-500" htmlFor="description">Description</label>
           <textarea className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md focus:border-orange-300 border-gray-300 resize-none" id="description" rows={4} />
       </div>
       <button className="mt-5 w-full bg-orange-500 hover:bg-orange-600 mt-4 p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 shadow-sm text-sm rounded-md ">Upload product</button>
     </div>
   );
 };

 export default Upload;