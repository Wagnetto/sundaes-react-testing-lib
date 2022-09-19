import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  //make sure total starts $0,00
  const scoopSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopSubtotal).toHaveTextContent("0.00");

  //update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "1");
  expect(scoopSubtotal).toHaveTextContent("2.00");

  //update chocolate scoops to 2 and check the subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await userEvent.clear(chocolateInput);
  await userEvent.type(chocolateInput, "2");
  expect(scoopSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when toppings change", async () => {
  render(<Options optionType="toppings" />);

  //make sure total starts $0,00
  const toppingsTotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsTotal).toHaveTextContent("0.00");

  //update Cherries topping to 1 and check the subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  await userEvent.click(cherriesCheckbox);
  expect(cherriesCheckbox).toBeChecked();
  expect(toppingsTotal).toHaveTextContent("1.50");

  //update M&Ms checkbox and update the subtotal
  const mmsCheckbox = await screen.findByRole("checkbox", {
    name: "M&Ms",
  });

  await userEvent.click(mmsCheckbox);
  expect(mmsCheckbox).toBeChecked();
  expect(toppingsTotal).toHaveTextContent("3.00");

  //uncheck Cherries, and update subtotal

  await userEvent.click(cherriesCheckbox);
  expect(cherriesCheckbox).not.toBeChecked();
  expect(toppingsTotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    //check if grandTotal starts at "0.00"
    expect(grandTotal).toHaveTextContent("0.00");

    //update Vanilla scoops to 2 and check grand total
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    //add cherries topping and check grand total
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    await userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("5.50");
  });
  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />);

    //add cherries topping first
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await userEvent.click(cherriesCheckbox);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("1.50");

    //update vanilla scoop to 2 and check grand total 5.50
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if an item is removed", async () => {
    render(<OrderEntry />);
    //add cherries
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await userEvent.click(cherriesCheckbox);
    //1.50
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "2");
    //5.50
    //remove 1 scoop of Vanilla
    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "1");

    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    //remove cherries and check grand total 3.50
    expect(grandTotal).toHaveTextContent("3.50");

    //remove cherries
    await userEvent.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
