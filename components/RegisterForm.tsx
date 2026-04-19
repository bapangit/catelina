"use client";

import { useState, useTransition } from "react";

import styles from "@/app/Page.module.css";

type FormState = {
  error: string;
  success: string;
};

const initialState: FormState = {
  error: "",
  success: "",
};

export default function RegisterForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    setState(initialState);

    startTransition(async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as {
          error?: string;
          message?: string;
        };

        if (!response.ok) {
          setState({
            error: data.error ?? "Registration failed.",
            success: "",
          });
          return;
        }

        form.reset();
        setState({
          error: "",
          success: data.message ?? "User registered successfully.",
        });
      } catch {
        setState({
          error: "Something went wrong while submitting the form.",
          success: "",
        });
      }
    });
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      <div className={styles.formField}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required />
      </div>

      <div className={styles.formField}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className={styles.formField}>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" minLength={8} required />
      </div>

      <button className={styles.registerButton} disabled={isPending} type="submit">
        {isPending ? "Creating..." : "Create Account"}
      </button>

      <p
        aria-live="polite"
        className={state.error ? styles.formError : styles.formSuccess}
      >
        {state.error || state.success}
      </p>
    </form>
  );
}
