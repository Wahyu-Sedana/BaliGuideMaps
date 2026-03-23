import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CategoryFilter } from "../src/presentation/components";
import { Category } from "../src/domain/entities";

const mockCategories: Category[] = [
  { id: "1", name: "wisata" },
  { id: "2", name: "health" },
  { id: "3", name: "hotel" },
];

describe("CategoryFilter", () => {
  const mockOnCategorySelect = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all categories", () => {
    const { getAllByTestId } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId={null}
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const buttons = getAllByTestId(/category-button/);
    expect(buttons).toHaveLength(mockCategories.length + 1); // +1 for "All"
  });

  it('should show "All" button with clear option', () => {
    const { getByTestId } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId="1"
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const allButton = getByTestId("category-button-all");
    expect(allButton).toBeTruthy();
  });

  it("should highlight selected category", () => {
    const { getByTestId } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId="1"
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const selectedButton = getByTestId("category-button-1");
    expect(selectedButton).toHaveStyle({ opacity: 1 });
  });

  it("should call onCategorySelect when category is tapped", () => {
    const { getByTestId } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId={null}
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const categoryButton = getByTestId("category-button-1");
    fireEvent.press(categoryButton);

    expect(mockOnCategorySelect).toHaveBeenCalledWith("1");
  });

  it('should clear selection when "All" is tapped', () => {
    const { getByTestId } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId="1"
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const allButton = getByTestId("category-button-all");
    fireEvent.press(allButton);

    expect(mockOnCategorySelect).toHaveBeenCalledWith(null);
  });

  it("should render empty list when no categories", () => {
    const { queryAllByTestId } = render(
      <CategoryFilter
        categories={[]}
        selectedCategoryId={null}
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    const buttons = queryAllByTestId(/category-button/);
    // Only "All" button
    expect(buttons).toHaveLength(1);
  });

  it("should display category names", () => {
    const { getByText } = render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategoryId={null}
        onCategorySelect={mockOnCategorySelect}
      />,
    );

    expect(getByText("wisata")).toBeTruthy();
    expect(getByText("health")).toBeTruthy();
    expect(getByText("hotel")).toBeTruthy();
  });
});
