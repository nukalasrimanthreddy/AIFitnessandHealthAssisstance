import 'bootstrap/dist/css/bootstrap.min.css';
const CustomTableHeader = ({ colName }) => (
    <th className="py-3 px-4 text-start text-secondary fw-semibold bg-light">
      {colName}
    </th>
  );
  
  const CustomTableData = ({ data }) => (
    <td className="py-3 px-4 border-top text-dark">
      {data}
    </td>
  );
  
  const CustomTable = ({ exercises }) => {
    return (
      <div className="table-responsive">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <CustomTableHeader colName="Exercise" />
              <CustomTableHeader colName="Sets" />
              <CustomTableHeader colName="Reps" />
              <CustomTableHeader colName="Weights" />
              <CustomTableHeader colName="Rest Between Sets" />
            </tr>
          </thead>
          <tbody>
            {exercises.map(({ exercise, sets, reps, weight, rest }, index) => (
              <tr key={index}>
                <CustomTableData data={exercise} />
                <CustomTableData data={sets} />
                <CustomTableData data={reps} />
                <CustomTableData data={weight} />
                <CustomTableData data={rest} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const ExerciseDay = ({ day }) => (
    <div className="bg-primary text-white text-center py-2 fs-5 fw-medium rounded-top">
      {day}
    </div>
  );
  
  export default function WeeklyPlan({ data }) {
    return data.length > 0 ? (
      <div className="row gy-4">
        {data.map(({ day, exercises }) => (
          <div key={day} className="col-12">
            <div className="border rounded shadow-sm">
              <ExerciseDay day={day} />
              <CustomTable exercises={exercises} />
            </div>
          </div>
        ))}
      </div>
    ) : null;
  }
  