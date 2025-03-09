"use client";
const CustomTableHeader = ({ colName }: any) => (
  <th className="font-medium p-4  text-black text-left">{colName}</th>
);

const CustomTableData = ({ data, type }: any) => (
  <td className="border-b bg-white/80 border-slate-100 p-4 text-black/80">
    {data}
  </td>
);

const CustomTable = ({ exercises }: any) => {
  return (
    <table className="border-collapse table-fixed w-full text-sm mb-3">
      <thead>
        <tr className={"border-b bg-white/10"}>
          <CustomTableHeader colName={"Exercise"} />
          <CustomTableHeader colName={"Sets"} />
          <CustomTableHeader colName={"Reps"} />
          <CustomTableHeader colName={"Weights"} />
          <CustomTableHeader colName={"Rest Between Sets"} />
        </tr>
      </thead>
      <tbody className="bg-white/50">
        {exercises.map(
          ({ exercise, sets, reps, weight, rest }: any, index: any) => (
            <tr key={index}>
              <CustomTableData data={exercise} type={"exercise"} />
              <CustomTableData data={sets} type={"sets"} />
              <CustomTableData data={reps} type={"reps"} />
              <CustomTableData data={weight} type={"weight"} />
              <CustomTableData data={rest} type={"rest"} />
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default CustomTable;
