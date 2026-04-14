import { InfoPageTemplate } from "./InfoPageTemplate";

export function SupportPage() {
  return (
    <InfoPageTemplate
      title="Live Support"
      subtitle="Reach our support team for urgent account and event issues."
      sections={[
        {
          heading: "Fastest Way",
          body: "Email support@dems.com with your issue summary, account email, and screenshots if available.",
        },
        {
          heading: "For Organizers",
          body: "Include event ID or payment reference so we can investigate quickly.",
        },
        {
          heading: "Response Time",
          body: "Most requests are handled within one business day.",
        },
      ]}
    />
  );
}
