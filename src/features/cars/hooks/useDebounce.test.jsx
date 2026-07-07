import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

const DebounceExample = ({ value }) => {
  const debouncedValue = useDebounce(value, 300);

  return <p>{debouncedValue}</p>;
};

describe("useDebounce", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("waits before showing the new value", () => {
    vi.useFakeTimers();
    const { rerender } = render(<DebounceExample value="Toy" />);

    expect(screen.getByText("Toy")).toBeTruthy();

    rerender(<DebounceExample value="Toyota" />);
    expect(screen.queryByText("Toyota")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("Toyota")).toBeTruthy();
  });

  it("clears the previous timer when the value changes again", () => {
    vi.useFakeTimers();
    const { rerender } = render(<DebounceExample value="K" />);

    rerender(<DebounceExample value="Ki" />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender(<DebounceExample value="Kia" />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText("Kia")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByText("Kia")).toBeTruthy();
  });
});
