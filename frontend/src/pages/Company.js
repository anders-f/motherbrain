import React, { useState, useEffect } from "react";
import styles from "./Company.module.css";
import TopBar from "../components/TopBar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useParams } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Company() {
  const [company, setCompany] = useState({});
  const [fundings, setFundings] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const url = new URL("http://localhost:8080/org");
    url.searchParams.set("name", name);

    fetch(url)
      .then((response) => response.json())
      .then(({ results: { hits } }) => {
        setCompany(hits[0]);
      });
  }, [name]);

  useEffect(() => {
    const url = new URL("http://localhost:8080/fundings");
    url.searchParams.set("query", name);

    fetch(url)
      .then((response) => response.json())
      .then(({ results: { hits } }) => {
        setFundings(hits);
      });
  }, [name]);

  const data = {
    labels: fundings.map((f) => f.announced_on),
    datasets: [
      {
        label: "$USD",
        data: fundings.map((f) => f.raised_amount_usd),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.raj}>
      <TopBar />
      <div className={styles.container}>
        <div className={styles.company}>
          <h1>
            <a href={company.homepage_url}>{company.company_name}</a>
          </h1>
          <div>
            <div>
              <p>
                <em>
                  {company.description !== ""
                    ? company.description
                    : company.short_description}
                </em>
              </p>
              <p>
                <strong>Employees:</strong> {company.employee_count}
              </p>
              <p>
                <strong>Country:</strong>{" "}
                {company.country_code !== ""
                  ? company.country_code
                  : " unknown"}
              </p>
              <p>
                <strong>Total funding:</strong>
                {company.funding_total_usd !== ""
                  ? ` US$ ${company.funding_total_usd}`
                  : " US$ 0"}
              </p>
            </div>
            {fundings.length > 0 && (
              <div>
                <Doughnut data={data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
