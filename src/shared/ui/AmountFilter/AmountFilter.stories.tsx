import type { Meta, StoryObj } from "@storybook/react";
import { AmountFilter } from "./AmountFilter";
import { useState } from "react";

const meta = {
  title: "Shared/AmountFilter",
  component: AmountFilter,
  tags: ["autodocs"],
  args: {
    value: "",
    onChange: () => undefined,
  },
} satisfies Meta<typeof AmountFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: { value: "50" },
};

function InteractiveStory() {
  const [value, setValue] = useState("");
  return <AmountFilter value={value} onChange={setValue} />;
}

export const Interactive: Story = {
  render: () => <InteractiveStory />,
};
