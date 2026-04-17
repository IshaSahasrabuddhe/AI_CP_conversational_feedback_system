import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await login(email, password);
      setToken(response.access_token);
      navigate("/");
    } catch (err) {
      setError("Unable to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-grid px-6 py-12">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to review feedback conversations and continue collecting structured input."
        submitLabel="Log in"
        alternateText="Need an account?"
        alternateLabel="Create one"
        alternateLink="/signup"
        onSubmit={handleSubmit}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        error={error}
        loading={loading}
      />
    </main>
  );
}
