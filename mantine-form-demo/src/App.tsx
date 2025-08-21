
import { IconUser, IconKey, IconCheck } from "@tabler/icons-react";
import { MultiStepForm, type StepConfig } from "./MultiStepForm";

function App() {
const steps: StepConfig[] = [
    {
      label: "Account",
      description: "Basic account info",
      icon: <IconUser size={18} />,
      fields: [
        { name: "username", label: "Username", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
      ],
    },
    {
      label: "Profile",
      description: "Personal details",
      icon: <IconKey size={18} />,
      fields: [
        { name: "age", label: "Age", type: "number" },
        { name: "gender", label: "Gender", type: "radio", data: ["Male", "Female", "Other"] },
        { name: "dob", label: "Date of Birth", type: "date" },
      ],
    },
    {
      label: "Preferences",
      description: "Choose your settings",
      icon: <IconCheck size={18} />,
      fields: [
        { name: "newsletter", label: "Subscribe to newsletter", type: "checkbox" },
        { name: "theme", label: "Dark Mode", type: "switch" },
      ],
    },
  ];

  const initialValues = {
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    dob: "",
    newsletter: false,
    theme: false,
  };

  const handleSubmit = (values: Record<string, any>) => {
    console.log("Form submitted:", values);
    alert("Form Submitted! Check console for values.");
  };

  return (
    <MultiStepForm steps={steps} initialValues={initialValues} onSubmit={handleSubmit} />
  );
}

export default App;
