import { useState } from "react";
import UserForm from "../components/UserForm";

function WorkoutHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <UserForm
        setData={setData}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

export default WorkoutHistory;
