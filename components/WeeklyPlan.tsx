"use client";
import CustomTable from "@/components/CustomTable";

const ExerciseDay = ({ day }: any) => (
  <div className="w-full text-xl text-center py-2  border-b text-black font-bold">
    {day}
  </div>
);

export default function WeeklyPlan({ data }: any) {
  return data.length > 0 ? (
    <div>
      {data?.map(({ day, exercises }: any) => (
        <div
          key={day}
          className={
            "bg-white/80 mb-10 shadow-md border border-slate-300 rounded-xl"
          }
        >
          <ExerciseDay day={day} />
          <CustomTable exercises={exercises} />
        </div>
      ))}
    </div>
  ) : undefined;
}
