import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VoteClient } from "../vote-client";
import { useLocalStorage } from "usehooks-ts";
import { submitVote } from "@/app/actions/submit-vote";
import { PieWithVotes } from "@/types/prisma";

// Mock the hooks and actions
jest.mock("usehooks-ts");
jest.mock("@/app/actions/submit-vote");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockUseLocalStorage = useLocalStorage as jest.Mock;
const mockSubmitVote = submitVote as jest.Mock;

describe("VoteClient", () => {
  const mockPies = [
    {
      id: "1",
      title: "Apple Pie",
      userName: "baker1",
      imageData: "/test-image.jpg",
      description: "A delicious apple pie",
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: [],
    },
    {
      id: "2",
      title: "Cherry Pie",
      userName: "baker2",
      imageData: "/test-image-2.jpg",
      description: "A tasty cherry pie",
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: [],
    },
  ] satisfies PieWithVotes[];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage to return a stable value
    mockUseLocalStorage.mockReturnValue(["testUser", jest.fn()]);
    mockSubmitVote.mockResolvedValue({ success: true });
  });

  it("renders all pies", () => {
    render(<VoteClient initialPies={mockPies} />);
    expect(screen.getByText("Apple Pie")).toBeDefined();
    expect(screen.getByText("Cherry Pie")).toBeDefined();
  });

  it("shows correct number of remaining stars", () => {
    const piesWithNoVotes = mockPies.map((pie) => ({
      ...pie,
      votes: [],
    }));
    render(<VoteClient initialPies={piesWithNoVotes} />);
    expect(screen.getByText(/Remaining Stars: ⭐⭐⭐/)).toBeDefined();
  });

  it("updates remaining stars after voting", async () => {
    render(<VoteClient initialPies={mockPies} />);

    const voteButton = screen.getAllByText("⭐")[0];
    fireEvent.click(voteButton);

    await waitFor(() => {
      expect(mockSubmitVote).toHaveBeenCalledWith("1", "testUser", 1);
      expect(screen.getByText(/Remaining Stars: ⭐⭐/)).toBeDefined();
    });
  });

  it('shows "Already voted!" after voting for a pie', async () => {
    const mockVote = {
      id: "vote1",
      userName: "testUser",
      stars: 1,
      pieId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const piesWithVote = [
      {
        ...mockPies[0],
        votes: [mockVote],
      },
      mockPies[1],
    ];

    render(<VoteClient initialPies={piesWithVote} />);
    expect(screen.getByText("Already voted!")).toBeDefined();
  });

  it("prevents voting when no stars remain", async () => {
    const mockVote = {
      id: "vote1",
      userName: "testUser",
      stars: 1,
      pieId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const piesWithAllStarsUsed = [
      {
        ...mockPies[0],
        votes: [{ ...mockVote, stars: 3 }],
      },
      mockPies[1],
    ];

    render(<VoteClient initialPies={piesWithAllStarsUsed} />);
    expect(
      screen.getByText(/Remaining Stars:.*\(All stars used!\)/)
    ).toBeDefined();
    expect(screen.getByText("No stars remaining!")).toBeDefined();
  });

  it("redirects to home when no username is set", () => {
    mockUseLocalStorage.mockReturnValueOnce(["", jest.fn()]);
    const { container } = render(<VoteClient initialPies={mockPies} />);
    expect(container.children.length).toBe(0);
  });
});
