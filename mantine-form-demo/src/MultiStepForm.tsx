import { useState} from "react";
import type { ReactNode } from "react";
import {
  Stepper,
  Button,
  Group,
  Paper,
  Card,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  PasswordInput,
  Checkbox,
  Switch,
  Radio,
  Box,
  Title,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";

export type FieldConfig = {
  name: string;
  label?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "switch"
    | "radio"
    | "date"
    | "custom";
  placeholder?: string;
  required?: boolean;
  data?: string[];
  validate?: (value: any) => string | null;
  render?: (form: any) => ReactNode; 
};

export type StepConfig = {
  label: string;
  description?: string;
  icon?: ReactNode;
  fields: FieldConfig[];
};

type MultiStepFormProps = {
  steps: StepConfig[];
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
};


function Field({ field, form }: { field: FieldConfig; form: any }) {
  if (field.type === "custom" && field.render) {
    return <>{field.render(form)}</>;
  }

  const commonProps = {
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    ...form.getInputProps(field.name),
  };

  switch (field.type) {
    case "text":
    case "email":
      return <TextInput type={field.type} {...commonProps} />;
    case "password":
      return <PasswordInput {...commonProps} />;
    case "number":
      return <NumberInput {...commonProps} />;
    case "select":
      return <Select data={field.data || []} {...commonProps} />;
    case "textarea":
      return <Textarea {...commonProps} />;
    case "checkbox":
      return (
        <Checkbox
          label={field.label}
          {...form.getInputProps(field.name, { type: "checkbox" })}
        />
      );
    case "switch":
      return (
        <Switch
          label={field.label}
          {...form.getInputProps(field.name, { type: "checkbox" })}
        />
      );
    case "radio":
      return (
        <Radio.Group label={field.label} {...form.getInputProps(field.name)}>
          {field.data?.map((option) => (
            <Radio key={option} value={option} label={option} />
          ))}
        </Radio.Group>
      );
    case "date":
      return <DateInput {...commonProps} />;
    default:
      return null;
  }
}

export function MultiStepForm({
  steps,
  initialValues,
  onSubmit,
}: MultiStepFormProps) {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const validations = steps.reduce((acc, step) => {
    step.fields.forEach((f) => {
      if (f.validate) acc[f.name] = f.validate;
    });
    return acc;
  }, {} as Record<string, (value: any) => string | null>);

  const form = useForm({ initialValues, validate: validations });

  const nextStep = () => {
    if (form.validate().hasErrors) return;
    setActive((c) => Math.min(c + 1, steps.length));
  };

  const prevStep = () => setActive((c) => Math.max(c - 1, 0));

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          colorScheme === "dark"
            ? theme.colors.dark[7]
            : "linear-gradient(135deg, #4e54c8, #8f94fb)",
        padding: "2rem",
      }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        withBorder
        w={600}
        bg={colorScheme === "dark" ? theme.colors.dark[6] : "white"}
      >
        <Title order={2} ta="center" mb="lg" c="indigo">
          Multi-Step Form Wizard
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
  <Stepper active={active} onStepClick={setActive}>
    {steps.map((step, i) => (
      <Stepper.Step
        key={i}
        icon={step.icon}
        label={step.label}
        description={step.description}
      >
        <Card shadow="sm" radius="md" p="md" withBorder>
          {step.fields.map((field) => (
            <Box key={field.name} mt="md">
              <Field field={field} form={form} />
            </Box>
          ))}
        </Card>
      </Stepper.Step>
    ))}

    <Stepper.Completed>
      <Title order={3}>Review & Submit</Title>
      <Card shadow="md" radius="md" p="md" withBorder>
        <pre>{JSON.stringify(form.values, null, 2)}</pre>
      </Card>
    </Stepper.Completed>
  </Stepper>

          <Group justify="space-between" mt="xl">
            {active > 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < steps.length ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" color="indigo" leftSection={<IconCheck />}>
                Submit
              </Button>
            )}
          </Group>
        </form>
      </Paper>
    </Box>
  );
}
