import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GlobalErrorBoundary from "./GlobalErrorBoundary";

const BrokenPage = () => {
  throw new Error("Test render error");
};

describe("GlobalErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a recovery screen when a child crashes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <GlobalErrorBoundary>
        <BrokenPage />
      </GlobalErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });
});
