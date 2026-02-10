
import Image from 'next/image'
import SelectCountry from './SelectCountry'
import { updateGuest} from '../_lib/actions';
import SubmitButton from './SubmitButton';



type UpdateProfileFormProps = {
  guest:{
        fullName: string;
        email: string;
        nationality: string;
        nationalID: string;
        countryFlag: string;
    }

}

export default function UpdateProfileForm({ guest }: UpdateProfileFormProps) {

  const {fullName, email, nationality, nationalID,countryFlag} = guest;
  return (
    <form action={updateGuest} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
        <div className="space-y-2">
          <label>Full name</label>
          <input
            defaultValue={fullName}
            name="fullName"
            disabled
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label>Email address</label>
          <input
           defaultValue={email}
            name="email"
            disabled
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="nationality">Where are you from?</label>
            <img
              src={countryFlag}           
              alt="Country flag"
              className="h-5 rounded-sm "
              />
          </div>

          <SelectCountry
            name="nationality"
            id="nationality"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultCountry={nationality}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="nationalID">National ID number</label>
          <input
          defaultValue={nationalID}
            name="nationalID"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

            <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
      </div>
      </form>
  )
}

