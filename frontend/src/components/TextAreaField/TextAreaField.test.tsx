import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import TextAreaField from "./TextAreaField";

describe("TextAreaField", () => {
  it("should render with placeholder and initial value", () => {
    render(
      <TextAreaField
        value=""
        onChange={() => { }}
        options={{ placeholder: "Type here..." }}
      />
    );

    const textarea = screen.getByPlaceholderText("Type here...");
    expect(textarea).toBeTruthy();
    expect(textarea).toHaveValue("");
  });

  it("should add bullet at the start when typing first character", () => {
    const onChangeMock = vi.fn();
    render(<TextAreaField value="" onChange={onChangeMock} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(onChangeMock).toHaveBeenCalledWith("• Hello");
  });

  it("should add bullet on new line if previous line is not empty", () => {
    let value = "• First line";
    const onChangeMock = vi.fn((val) => (value = val));

    render(<TextAreaField value={value} onChange={onChangeMock} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: value + "\n" } });

    expect(onChangeMock).toHaveBeenCalledWith("• First line\n• ");
  });

  it("should not add bullet on new line if previous line is empty", () => {
    let value = "• ";
    const onChangeMock = vi.fn((val) => (value = val));

    render(<TextAreaField value={value} onChange={onChangeMock} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: value + "\n" } });

    expect(onChangeMock).toHaveBeenCalledWith("• \n");
  });
});
