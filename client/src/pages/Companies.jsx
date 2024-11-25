import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CompanyCard,
  CustomButton,
  Header,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateURL } from "../utils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsFetching(true);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort: sort,
      navigate: navigate,
      location: location,
    });

    try {
      const res = await apiRequest({
        url: newURL,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data);

      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchCompanies();
  };

  const handleShowMore = () => {};

  useEffect(() => {
    fetchCompanies();
  }, [page, sort]);

  return (
    <div className="w-full">
      <Header
        title="Find Your Dream Company"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setCmpLocation}
      />

      <div className="container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 py-6 bg-[#f7fdfd]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm md:text-base">
            Showing: <span className="font-semibold">{recordsCount}</span>{" "}
            Companies Available
          </p>

          <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
            <p className="text-sm md:text-base">Sort By:</p>
            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.map((cmp, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-5 flex items-center justify-between gap-5"
            >
              {/* Company Logo */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {cmp.profileUrl ? (
                  <img
                    src={cmp.profileUrl}
                    alt={cmp.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {cmp.name[0]}
                  </span> // Fallback for missing logo
                )}
              </div>

              {/* Company Details */}
              <div className="flex flex-col flex-grow">
                <p className="text-lg font-semibold text-gray-800">
                  {cmp.name}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 4.6 7 11 7 11s7-6.4 7-11c0-3.9-3.1-7-7-7zM12 13c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"></path>
                  </svg>
                  <span>{cmp.location}</span>
                </div>

                <p className="text-sm text-gray-500 mt-2">{cmp.about}</p>
              </div>

              {/* View Projects Button */}
              <div className="flex flex-col items-end">
                <CustomButton
                  onClick={() => navigate(`/company-profile/${cmp._id}`)}
                  title="View Projects"
                  containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                />
              </div>
            </div>
          ))}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}
        </div>

        {numPage > page && !isFetching && (
          <div className="w-full flex items-center justify-center pt-16">
            <CustomButton
              onClick={handleShowMore}
              title="Load More"
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
