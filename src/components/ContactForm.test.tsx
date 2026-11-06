// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "../test/mockMatchMedia";
import { ContactForm } from "./ContactForm";

beforeAll(() => {
  mockMatchMedia();
});

afterEach(cleanup);

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function fillOutForm() {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello there" } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Loved the site, great work!" } });
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("disables inputs and shows the sending state while submitting", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    );

    fillOutForm();
    fireEvent.submit(screen.getByRole("button", { name: /send message/i }).closest("form")!);

    expect((screen.getByLabelText(/name/i) as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByText(/sending\.\.\./i)).toBeTruthy();
  });

  it("navigates to /thank-you after the dev-mode submit timer fires", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    );

    fillOutForm();
    fireEvent.submit(screen.getByRole("button", { name: /send message/i }).closest("form")!);

    vi.advanceTimersByTime(700);

    expect(navigateMock).toHaveBeenCalledWith("/thank-you");
  });
});
