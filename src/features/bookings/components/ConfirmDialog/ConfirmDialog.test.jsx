import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ConfirmDialog from "./ConfirmDialog";

const booking = {
  id: "b1",
  carName: "Toyota Corolla",
};

describe("ConfirmDialog", () => {
  it("keeps keyboard focus inside and closes with Escape", () => {
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        booking={booking}
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    );

    const keepButton = screen.getByRole("button", { name: "Keep booking" });
    const cancelButton = screen.getByRole("button", {
      name: "Cancel booking",
    });

    expect(document.activeElement).toBe(keepButton);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(cancelButton);

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(keepButton);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
