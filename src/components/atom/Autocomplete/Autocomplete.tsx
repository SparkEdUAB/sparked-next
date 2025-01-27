import { ChangeEventHandler, useState } from 'react';
import { Label, TextInput } from 'flowbite-react';
import { useFetch } from '@hooks/use-swr';
import useDebounceValue from '@hooks/use-debounce';
import { RedAsterisk } from '..';

type ItemType = {
  _id: string;
  name: string;
};

/**
 * TODO: Make this component more reusable for other collections we have in the subjects
 * Instead of fetching everything when we want to assign just a single id, we should instead fetch by name and then assign that value
 * Link to fetch should be passed as a prop
 * handleClick fn should be passed as a prop
 * and anything else possible to make sure this is reused for Grades,Subjects, Topics, Units & Media contents
 * TODO: Display the default value in the input field if the value is passed
 */

interface Props<T extends ItemType> {
  url: string;
  /**
   * TODO: If no query is provided search module name with at least 5 options to provide default values, this means we need to provide a fallback url
   */
  defaultValue?: string;
  fallbackUrl?: string;
  handleSelect: (suggestion: T) => void; // suggestion here, we are interested in id and name
  /**
   * This should match the collection, e.g. subjects, grades, topics, units, media-contents
   * TODO: Set this as an enum to only accept the values we have in the app
   */
  moduleName: string;
  required?: boolean;
  disabled?: boolean;
}

const Autocomplete = <T extends ItemType>({
  url,
  handleSelect,
  moduleName,
  defaultValue = "",
  required,
  disabled,
}: Props<T>) => {
  const [query, setQuery] = useState(defaultValue);
  const [autoCompleted, setAutoCompleted] = useState<boolean>(false);
  const debouncedValue: string = useDebounceValue<string>(query as string, 500);
  const { data, isLoading, isValidating } = useFetch(
    query && autoCompleted ? `${url}?name=${debouncedValue}` : undefined,
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);
    setAutoCompleted(true);
  };

  const handleClick = (suggestion: T) => {
    setQuery(suggestion.name); // we will need to pick the id
    setAutoCompleted(false);
    handleSelect(suggestion);
  };

  const loading = isLoading || isValidating;

  if (!url && !moduleName) return null;

  return (
    <div className="relative w-full">
      <div className="mb-2 block capitalize">
        <Label htmlFor={moduleName} className="cursor-pointer">
          {moduleName} {required && <RedAsterisk />}
        </Label>
      </div>
      <TextInput
        id={moduleName}
        type="text"
        value={query}
        name={moduleName}
        onChange={handleChange}
        placeholder={`Search for ${moduleName}`}
        className="block w-full"
        autoComplete="off"
        required={required}
        disabled={disabled}
      />
      {autoCompleted && (query || moduleName === "userRoles") && !disabled && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
          {data?.[moduleName]?.length ? (
            data?.[moduleName]?.map((subject: any) => (
              <li
                key={subject._id}
                onClick={() => handleClick(subject)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                {subject.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 cursor-pointer dark:text-gray-200">
              {loading ? 'searching ...' : 'Nothing found'}{' '}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;