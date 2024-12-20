import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsCheck2, BsChevronExpand } from "react-icons/bs";

const types = ["Full-Time", "Part-Time", "Contract", "Intern"];

const ProjectTypes = ({ projectTitle, setProjectTitle }) => {
  return (
    <div className="w-full">
      <Listbox value={projectTitle} onChange={setProjectTitle}>
        <div className="relative">
          {/* Listbox button with improved padding and focus styles */}
          <Listbox.Button className="relative w-full cursor-default rounded bg-white py-2.5 pl-3 pr-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm">
            <span className="block truncate">{projectTitle}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </span>
          </Listbox.Button>

          {/* Transition for dropdown menu */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {types.map((type, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={type}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {type}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <BsCheck2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ProjectTypes;