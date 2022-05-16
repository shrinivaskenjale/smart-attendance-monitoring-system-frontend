import React from "react";
import styles from "../styles/tables.module.css";
import Link from "next/link";
import { useState } from "react";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

const FilteredRecords = React.forwardRef((props, ref) => {
  const {
    records,
    type,
    forStudent,
    conductedLecturesCount,
    mode,
    studentsCount,
  } = props;
  // state
  const [data, setData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    labels: [],
  });
  // state end

  // render

  let content = <p className="msg">No recods found.</p>;

  if (records.length > 0 && mode === "table") {
    let recordsList = records.map((record) => {
      const date = new Date(record.createdAt);
      return (
        <tr key={record._id} className={styles.row}>
          <td>{date.toLocaleString("en-IN")}</td>
          {type === "all" && <td>{record.present.length}</td>}
          {!forStudent && (
            <td className={styles.action}>
              <Link href={"/records/" + record._id}>
                <a className={styles.link}>
                  {type === "single" ? "Edit" : "View"}
                </a>
              </Link>
            </td>
          )}
        </tr>
      );
    });

    content = (
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th>Date</th>
            {type === "all" && <th>Count</th>}
            {!forStudent && <th className={styles.action}>Action</th>}
          </tr>
        </thead>
        <tbody>{recordsList}</tbody>
      </table>
    );
  } else if (records.length > 0 && mode === "graph") {
    if (type === "single") {
      const presentCount = records.length;
      const absentCount = conductedLecturesCount - presentCount;

      content = (
        <PieChart presentCount={presentCount} absentCount={absentCount} />
      );
    } else if (type == "all") {
      const labels = [];
      const datasets = [
        {
          label: "Present",
          data: [],
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Absent",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];

      records.forEach((record) => {
        const date = new Date(record.createdAt);
        labels.push(date.toLocaleString("en-IN"));
        datasets[0].data.push(record.present.length);
        datasets[1].data.push(studentsCount - record.present.length);
      });

      content = <BarGraph labels={labels} datasets={datasets} />;
    }
  }

  return (
    <div className={styles.filteredContent} ref={ref}>
      {content}
    </div>
  );
});

FilteredRecords.displayName = "FilteredRecords";

export default FilteredRecords;
