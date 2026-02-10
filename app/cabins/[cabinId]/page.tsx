import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import TextExpander from "@/app/_components/TextExpander";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Suspense } from "react";




interface PageProps {
  params: {
    cabinId: string; 
  };
}



export async function generateMetadata({params}: PageProps){
        const { cabinId } = await params;
        const numericCabinId = parseInt(cabinId, 10);

        const {name}= await getCabin(numericCabinId);

        return {
            title: `Cabin ${name}`,
            
        }

};



export async function generateStaticParams(){
    const cabins = await getCabins();
    const ids = cabins.map((cabin) => ({cabinId: String(cabin.id)}) )                           
   
    return ids
}



export default async function Page({params}: PageProps ) {

  const { cabinId } = await params; // <-- await here
  const numericCabinId = parseInt(cabinId, 10);

  const cabin = await getCabin(numericCabinId);



  return (
    <div className="max-w-6xl mx-auto mt-8">

      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
