import InstructionsCard from "./InstructionsCard";


const Instructions = () => {
  return (
    <div className="instructions mt-4">
      <h2 className="text-primary" >How to Use This Application</h2>
      <InstructionsCard title="Sign Up or Log In" description="Create an account or log in to access your dashboard." />
      <InstructionsCard title="Navigate to Dashboard" description="View your data and analytics on the dashboard." />
      <InstructionsCard title="Use Filters" description="Customize your view with the available filters." />
      <InstructionsCard title="Click for Details" description="Click on any item for more detailed information." />
      <InstructionsCard title="Contact Support" description="Reach out to support if you need assistance." />
    </div>
  );
};

export default Instructions;