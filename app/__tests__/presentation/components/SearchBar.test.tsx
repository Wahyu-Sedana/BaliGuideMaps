import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "../src/presentation/components";

describe("SearchBar", () => {
  const mockOnChangeText = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search locations"
        value=""
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Search locations");
    expect(input).toBeTruthy();
  });

  it("should display placeholder text", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Find places"
        value=""
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Find places");
    expect(input).toBeTruthy();
  });

  it("should display current value", () => {
    const { getByDisplayValue } = render(
      <SearchBar
        placeholder="Search"
        value="Tanah Lot"
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByDisplayValue("Tanah Lot");
    expect(input).toBeTruthy();
  });

  it("should call onChangeText when text changes", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search"
        value=""
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Search");
    fireEvent.changeText(input, "Bali Temple");

    expect(mockOnChangeText).toHaveBeenCalledWith("Bali Temple");
  });

  it("should allow multiple text changes", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search"
        value=""
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Search");

    fireEvent.changeText(input, "B");
    fireEvent.changeText(input, "Ba");
    fireEvent.changeText(input, "Bal");

    expect(mockOnChangeText).toHaveBeenCalledTimes(3);
    expect(mockOnChangeText).toHaveBeenNthCalledWith(1, "B");
    expect(mockOnChangeText).toHaveBeenNthCalledWith(2, "Ba");
    expect(mockOnChangeText).toHaveBeenNthCalledWith(3, "Bal");
  });

  it("should clear text when value is emptied", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search"
        value="Tanah Lot"
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Search");
    fireEvent.changeText(input, "");

    expect(mockOnChangeText).toHaveBeenCalledWith("");
  });

  it("should be editable by default", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search"
        value=""
        onChangeText={mockOnChangeText}
      />,
    );

    const input = getByPlaceholderText("Search");
    expect(input.props.editable).not.toBe(false);
  });

  it("should support disabled state", () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        placeholder="Search"
        value=""
        onChangeText={mockOnChangeText}
        editable={false}
      />,
    );

    const input = getByPlaceholderText("Search");
    expect(input.props.editable).toBe(false);
  });
});
