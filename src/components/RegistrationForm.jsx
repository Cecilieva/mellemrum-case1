import { useState } from "react";
import { supabaseRequest } from "../event";

export default function RegistrationForm({ eventId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    setSubmitStatus("sender");

    try {
      const matchingUsers = await supabaseRequest(
        `/users?select=id&email=eq.${encodeURIComponent(email)}`,
      );
      let user = matchingUsers[0];

      if (!user) {
        const newUsers = await supabaseRequest("/users", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ name, email }),
        });
        [user] = newUsers;
      }

      await supabaseRequest("/registrations", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          userId: user.id,
          eventId: Number(eventId),
          status: "Ny",
        }),
      });

      setName("");
      setEmail("");
      setSubmitStatus("success");
    } catch (submitError) {
      setSubmitStatus(submitError.message);
    }
  }

  return (
    <section className="signup-panel">
      <div>
        <p className="eyebrow dark">Tilmelding</p>
        <h2>Reserver din plads</h2>
        <p>Udfyld formularen, så sender vi din tilmelding til arrangøren.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Navn
          <input
            required
            value={name}
            onChange={(inputEvent) => setName(inputEvent.target.value)}
          />
        </label>
        <span>E-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(inputEvent) => setEmail(inputEvent.target.value)}
          placeholder="dig@example.com"
        />
        <button disabled={submitStatus === "sender"} type="submit">
          {submitStatus === "sender" ? "Sender..." : "Tilmeld mig"}
        </button>
        {submitStatus === "success" && (
          <p className="form-message">
            Du er tilmeldt. Vi glæder os til at se dig.
          </p>
        )}
        {submitStatus &&
          submitStatus !== "sender" &&
          submitStatus !== "success" && (
            <p className="form-message">{submitStatus}</p>
          )}
      </form>
    </section>
  );
}
