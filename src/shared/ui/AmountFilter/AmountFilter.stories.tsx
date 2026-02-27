import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
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

/**
 * Demonstrates the full input flow with interaction testing:
 * type a value, verify the hint updates to reflect the active filter.
 * Non-numeric characters are rejected by the input guard.
 */
export const TypingInteraction: Story = {
  render: () => <InteractiveStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("spinbutton", {
      name: "Filter by minimum amount",
    });

    // Type a valid numeric amount
    await userEvent.type(input, "99.50");

    // The hint should now be visible and mention the formatted amount
    const hint = canvas.getByText(/99/);
    await expect(hint).toBeInTheDocument();

    // Non-numeric input is rejected — the value should remain unchanged
    await userEvent.type(input, "abc");
    await expect(input).toHaveValue(99.5);
  },
};
