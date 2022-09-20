import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  // render App
  render(<App setOrderPhase={jest.fn()} />);

  //add icecream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
  await userEvent.clear(chocolateInput);
  await userEvent.type(chocolateInput, "2");

  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await userEvent.click(cherriesCheckbox);

  //find and click order button on OrderEntry page
  const orderSummaryButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(orderSummaryButton);

  //check summary information based on order
  const summaryHeading = await screen.findByRole("heading", {
    name: /order summary/i,
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  //chek summary options items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  //accept terms and conditions and click the button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton);

  //on confirmation page: confirm we have an order number
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  //click new order button on confirmation page

  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  userEvent.click(newOrderButton);

  //check scoops and toppings subtotals have been reset
  const scoopsTotal = screen.getByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  //wait for items to appear
  //cause we can get errors if the test exits before the component is finished updating
  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });

  //do we need to await enything to avoid test errors?
});
