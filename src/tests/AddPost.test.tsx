import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { toast } from "react-toastify";
import AddPost from '../pages/addPost';
import postServices from "../redux/api/postService";


jest.mock("../redux/api/postService");

const mockStore = configureStore([]);
const store = mockStore({
  filter: { countries: [], cities: [] },
  posts: { posts: [] },
});

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AddPost Component", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AddPost />
        </BrowserRouter>
      </Provider>
    );
  });

  test("renders form fields correctly", () => {
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Travel From/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Travel To/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Return Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tell us about your plans/i)).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    fireEvent.click(screen.getByText(/Add Post/i));
    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
      expect(screen.getByText(/City is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Departure date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Return date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
    });
  });

  test("updates form fields on input", () => {
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: "My Trip" } });
    expect(titleInput).toHaveValue("My Trip");
  });

  test("submits form successfully", async () => {
    (postServices.createPost as jest.Mock).mockResolvedValue({ status: 201 });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "My Trip" } });
    fireEvent.change(screen.getByLabelText(/Departure Date/i), { target: { value: "2025-12-01" } });
    fireEvent.change(screen.getByLabelText(/Return Date/i), { target: { value: "2025-12-10" } });
    fireEvent.change(screen.getByLabelText(/Tell us about your plans/i), { target: { value: "Exciting adventure!" } });

    fireEvent.click(screen.getByText(/Add Post/i));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Post created successfully");
    });
  });

  test("handles API failure on submission", async () => {
    (postServices.createPost as jest.Mock).mockRejectedValue({
      response: { data: { errors: [{ detail: "Server error", attr: "title" }] } },
    });

    fireEvent.click(screen.getByText(/Add Post/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error (title)");
    });
  });

  test("adds and removes image previews", async () => {
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    const input = screen.getByLabelText(/Upload Images/i);

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("preview-0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByAltText("preview-0")).not.toBeInTheDocument();
    });
  });
});
