import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RouteFocusManager from "./RouteFocusManager";

describe("RouteFocusManager", () => {
  it("moves focus to the new page heading after navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <RouteFocusManager />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h1>Car Browser</h1>
                <Link to="/bookings">My Bookings</Link>
              </main>
            }
          />
          <Route
            path="/bookings"
            element={
              <main>
                <h1>My Bookings</h1>
              </main>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "My Bookings" }));
    const heading = screen.getByRole("heading", { name: "My Bookings" });

    await waitFor(() => {
      expect(document.activeElement).toBe(heading);
    });
  });
});
