import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";

test("box turns red with invalid input", async () => {
  render(<ScoopOption />);
  //invalid with negative number
  const vanillaInput = screen.getByRole("spinbutton");
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "-1");
  expect(vanillaInput).toHaveClass("is-invalid");

  //invalid with decimal input
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "2.5");
  expect(vanillaInput).toHaveClass("is-invalid");

  //replace with high input
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "11");
  expect(vanillaInput).toHaveClass("is-invalid");

  //replace valid input
  //make sure display turns off the red again
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "3");
  expect(vanillaInput).not.toHaveClass("is-invalid");
});
