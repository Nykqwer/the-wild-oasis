import { getCountries } from '@/app/_lib/data-service';

// Country type
type Country = {
  name: string;
  flag: string;
};

type SelectCountryProps = {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
};

async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
}: SelectCountryProps) {
  const countries: Country[] = await getCountries();

  const flag =
    countries.find(
      (country: Country) => country.name === defaultCountry
    )?.flag ?? '';

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
      key={defaultCountry}
    >
      <option value="">Select country...</option>
      {countries.map((c: Country) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
