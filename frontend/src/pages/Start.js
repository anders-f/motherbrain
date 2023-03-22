import React, { useState } from "react";
import styles from "./Start.module.css";

export default function Start() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchCompanies = (query, limit) => {
    const url = new URL("http://localhost:8080/orgs/search");
    url.searchParams.set("limit", limit ?? 5);
    url.searchParams.set("query", query);

    fetch(url)
      .then((response) => response.json())
      .then(({ results: { hits } }) => {
        setSearchResult(hits);
      });
  };

  const handleSearch = (e) => {
    // in a real app this would be debounced
    const query = e?.target?.value;
    setSearchInput(query);
    searchCompanies(query, 5);
  };

  const fundings = (rounds) => {
    const fundingRounds = parseInt(rounds);
    return Array.from(Array(fundingRounds));
  };

  return (
    <div className={styles.searchContainer}>
      <svg
        width="200"
        version="1.1"
        viewBox="-0.96 -0.96 111.72001 33.92"
        fill="#fff"
      >
        <title>EQT logo</title>
        <g>
          <path d="m 68.53991,31.6474 -12.7985,-12.7985 3.6769,-3.6769 12.7985,12.7985 z M 92.50001,11.6 l 5.2,0 0,19.5 -5.2,0 z M 0,0.8 l 5.2,0 0,30.3 -5.2,0 z m 10.8,25.1 18.5,0 0,5.2 -18.5,0 z m 0,-12.6 18.5,0 0,5.2 -18.5,0 z m 0,-12.5 18.5,0 0,5.2 -18.5,0 z m 69.60001,0 29.4,0 0,5.2 -29.4,0 z M 46,16 c 0,-5.9 4.80001,-10.8 10.80001,-10.8 6,0 10.7,4.9 10.7,10.8 0,0 0,0 0,0.1 l 5.2,0 c 0,0 0,0 0,-0.1 0,-8.8 -7.2,-16 -16,-16 C 47.9,0 40.7,7.2 40.7,16 c 0,8.8 7.1,16 15.90001,16 l 0,-5.2 C 50.70001,26.7 46,21.9 46,16 Z"></path>
        </g>
      </svg>
      <div className={styles.searchInputContainer}>
        <div>
          <i>
            <svg
              width="30"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="#ff6c27"
            >
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
          </i>
          <input
            type="search"
            name="search"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search ALL companies..."
            className={styles.search}
            autoComplete="off"
          />
        </div>
        {searchResult.length > 0 && (
          <div className={styles.result}>
            {searchResult.map((company) => (
              <div key={company.uuid} className={styles.item}>
                <a href={`/company/${company.company_name}`}>
                  <div>
                    <span className={styles.name}>{company.company_name}</span>
                    <span>
                      {company.city !== "" ? company.city : "City unknown"},{" "}
                    </span>
                    <span>
                      {company.country_code !== ""
                        ? company.country_code
                        : "Country unknown"}
                    </span>
                  </div>
                  <div className={styles.cash}>
                    {fundings(company.funding_rounds).map(() => (
                      <span>$</span>
                    ))}
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
