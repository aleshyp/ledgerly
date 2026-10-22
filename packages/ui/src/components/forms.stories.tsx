import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Field } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Forms",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "`Field` connects a label, description and error message to its control through context, so `id`, `aria-describedby` and `aria-invalid` are always correct.",
      },
    },
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    label: "Company name",
    description: "Shown on invoices and receipts.",
    children: <Input placeholder="Northwind Coffee Co." />,
  },
};

export const WithError: Story = {
  args: {
    label: "Routing number",
    required: true,
    error: "Routing numbers are 9 digits.",
    children: <Input defaultValue="02100002" inputMode="numeric" />,
  },
};

export const TextArea: Story = {
  args: {
    label: "Memo",
    children: <Textarea placeholder="Add a note for your accountant…" />,
  },
};

export const SelectMenu: Story = {
  args: {
    label: "Category",
    children: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="travel">Travel</SelectItem>
          <SelectItem value="payroll">Payroll</SelectItem>
          <SelectItem value="office">Office</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Account number",
    description: "Contact support to change your account number.",
    children: <Input defaultValue="···· 4821" disabled />,
  },
};

export const Choices: Story = {
  args: { children: null },
  render: () => (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" defaultChecked />
        <Label htmlFor="terms">Email me a weekly cash summary</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Select all transactions</Label>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="autopay">Autopay recurring bills</Label>
        <Switch id="autopay" defaultChecked />
      </div>
      <RadioGroup defaultValue="monthly" aria-label="Billing period">
        {["monthly", "quarterly", "annually"].map((value) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="capitalize">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};
