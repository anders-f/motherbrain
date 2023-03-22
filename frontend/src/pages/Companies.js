import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import styles from "./Companies.module.css";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchFundedCompanies = (limit, offset) => {
    const url = new URL("http://localhost:8080/orgs");
    url.searchParams.set("limit", limit);
    url.searchParams.set("offset", offset);

    fetch(url)
      .then((response) => response.json())
      .then(({ results: { hits } }) => {
        setCompanies((oldData) => oldData.concat(hits));
      });
  };

  useEffect(() => {
    fetchFundedCompanies(20, 0);
  }, []);

  const loadMore = () => {
    const newPageValue = page + 1;
    fetchFundedCompanies(pageSize, pageSize * newPageValue);
    setPage(newPageValue);
  };

  const fundings = (rounds) => {
    const fundingRounds = parseInt(rounds);
    return Array.from(Array(fundingRounds));
  };

  return (
    <div>
      <TopBar />
      {companies?.length > 0 && (
        <div className={styles.result}>
          {companies.map((company) => (
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
          <div className={styles.btn}>
            <button className={styles.load} onClick={loadMore}>
              Load more companies
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
