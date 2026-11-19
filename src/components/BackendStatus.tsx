
import { useEffect, useState } from "react";
import {
  getBackendHealth,
  type HealthResponse,
} from "../services/api";

function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBackendHealth()
      .then((data) => {
        setHealth(data);
      })
      .catch(() => {
        setError("Backend connection failed.");
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!health) {
    return <p>Connecting to backend...</p>;
  }

  return (
    <div>
      <strong>{health.application}</strong>
      <p>{health.message}</p>
      <small>Status: {health.status}</small>
    </div>
  );
}

export default BackendStatus;
