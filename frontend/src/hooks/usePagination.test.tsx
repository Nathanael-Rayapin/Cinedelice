import { describe, it, expect } from "vitest";
import { usePagination } from "./usePagination";
import { act, renderHook } from "@testing-library/react";

describe("usePagination", () => {
  const items = Array.from({ length: 20 }, (_, i) => i + 1);

  it("should initialize correctly", () => {
    const { result } = renderHook(() => usePagination(items, 5));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.pageNumbers).toEqual([1, 2, 3, 4]);
  });

  it("should go to next page", () => {
    const { result } = renderHook(() => usePagination(items, 5));

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([6, 7, 8, 9, 10]);
  });

  it("should go to previous page", () => {
    const { result } = renderHook(() => usePagination(items, 5));

    act(() => {
      result.current.goToPage(3);
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([6, 7, 8, 9, 10]);
  });

  it("should clamp page numbers correctly", () => {
    const { result } = renderHook(() => usePagination(items, 5));

    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.currentPage).toBe(4);
  });
});
