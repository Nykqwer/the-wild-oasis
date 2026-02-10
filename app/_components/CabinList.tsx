import { unstable_noStore as noStore } from "next/cache";
import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { Cabin } from "@/app/_lib/data-service";


type CabinListProps = {
  filter: string
}


 export async function CabinList({filter}: CabinListProps) {
  // noStore();

    const cabins: Cabin[] = await getCabins();

    if(!cabins.length) return null;



    const displayedCabins: Cabin[] = cabins.filter((cabin) => {
      switch(filter){
        case "small":
          return cabin.maxCapacity <=3;
        case "medium":
          return cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
        case "large":
          return cabin.maxCapacity >= 8;
        case "all":
        default:
          return true;

      }

    });

    
    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
          {displayedCabins.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
          ))}
        </div>
    )
}

export default CabinList
