import { fireEvent, render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("initial conditions", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", { label: "checkboxLabel" });
  expect(checkbox).not.toBeChecked();
});

test("checkbox enables and disables the button", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", { label: "checkboxLabel" });
  const button = screen.getByRole("button", { name: "Confirm order" });

  fireEvent.click(checkbox);
  expect(button).toBeEnabled();

  fireEvent.click(checkbox);
  expect(button).toBeDisabled();
});
