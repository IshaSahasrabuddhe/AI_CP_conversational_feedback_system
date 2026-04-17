import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../api/auth";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
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
      const response = await signup(email, password);
      setToken(response.access_token);
      navigate("/");
    } catch (err) {
      setError("Unable to create your account. Try a different email or a stronger password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-grid px-6 py-12">
      <AuthCard
        title="Create your workspace"
        subtitle="Start collecting conversational AI feedback with a state-driven review flow."
        submitLabel="Sign up"
        alternateText="Already have an account?"
        alternateLabel="Log in"
        alternateLink="/login"
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
