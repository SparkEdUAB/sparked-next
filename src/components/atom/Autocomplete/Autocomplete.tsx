import { useState } from 'react';
import { TextInput } from 'flowbite-react';
import { useFetch } from '@hooks/use-swr';
import useDebounceValue from '@hooks/use-debounce';

/**
 * TODO: Make this component more reusable for other collections we have in the subjects
 * Instead of fetching everything when we want to assign just a single id, we should instead fetch by name and then assign that value
 * Link to fetch should be passed as a prop
 *  handleClick fn should be passed as a prop
 * and anything else possible to make sure this is reused for Grades,Subjects, Topics, Units & Media contents
 */

interface Props {
  url: string;
  handleSelect: (suggestion: any) => void; // suggestion here, we are interested in id and name
  /**
   * This should match the collection, e.g. subjects, grades, topics, units, media-contents
   * TODO: Set this as an enum to only accept the values we have in the app
   * TODO: Display the default value in the input field if the value is passed
   */
  moduleName: string;
}

const Autocomplete = ({ url, handleSelect, moduleName }: Props) => {
  const [query, setQuery] = useState('');
  const [autoCompleted, setAutoCompleted] = useState<boolean>(false);
  const debouncedValue: string = useDebounceValue<string>(query, 500);
  const { data, isLoading, isValidating } = useFetch(query ? `${url}?name=${debouncedValue}` : undefined);

  const handleChange = (e: any) => {
    const userInput = e.target.value;
    setQuery(userInput);
    setAutoCompleted(true);
  };

  const handleClick = (suggestion: any) => {
    setQuery(suggestion.name); // we will need to pick the id
    setAutoCompleted(false);
    handleSelect(suggestion);
  };

  const loading = isLoading || isValidating;

  if (!url && !moduleName) return null; // this component should not display unless a url is passed
  return (
    <div className="relative w-full">
      <TextInput type="text" value={query} onChange={handleChange} placeholder="Search..." className="block w-full" />
      {autoCompleted && query && (
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
