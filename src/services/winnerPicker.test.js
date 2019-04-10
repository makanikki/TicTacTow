import { buildMatrice } from "./winnerPicker";
import { exploreVector, searchForWin, findWinPattern } from "./plop";

describe("winnerPicker", () => {
  describe("buildMatrice", () => {
    it("should build the proper matrice", () => {
      const board = {
        0: "O",
        1: "X",
        2: "X",
        3: "X",
        4: "O",
        5: "X",
        6: "O",
        7: "O",
        8: "X"
      };

      const expected = [["O", "X", "X"], ["X", "O", "X"], ["O", "O", "X"]];

      expect(buildMatrice(board)).toEqual(expected);
    });

    it("should build the proper matrice even if incomplete", () => {
      const board = {
        0: "X",
        1: "X",
        2: "X",
        3: undefined,
        4: "X",
        5: undefined,
        6: "O",
        7: "X",
        8: "O"
      };

      const expected = [
        ["X", "X", "X"],
        [undefined, "X", undefined],
        ["O", "X", "O"]
      ];

      expect(buildMatrice(board)).toEqual(expected);
    });
  });

  describe("searchForWin", () => {
    it("should look for pattern", () => {
      const matrice = [["X", "X", "O"], ["O", "X", "O"], ["O", "X", "X"]];
      expect(searchForWin(matrice)).toEqual({ "0,0_1,1": ["X", "X", "X"] });
    });

    it("should return undefined if no winning pattern", () => {
      const matrice = [["X", "X", "O"], ["O", "X", "O"], ["O", "X", "O"]];
      expect(searchForWin(matrice)).toBeUndefined();
    });
  });

  describe("exploreVector", () => {
    it("should explore vector", () => {
      const matrice = [["X", "X", "O"], ["O", "X", "O"], ["O", "X", "X"]];
      expect(exploreVector(matrice, [0, 0], [0, 1])).toEqual(["X", "X", "O"]);
    });
    it("should handle incompete game", () => {
      const matrice = [
        ["X", "X", "O"],
        [undefined, "X", undefined],
        ["O", "X", "X"]
      ];
      expect(exploreVector(matrice, [0, 0], [1, 0])).toEqual([
        "X",
        undefined,
        "O"
      ]);
    });
  });

  describe("findWinPattern", () => {
    it("should handle 1 winning line", () => {
      const lines = {
        first: ["X", "X", "O"],
        second: ["X", "O", "O"],
        third: ["X", "X", "X"]
      };

      expect(findWinPattern(lines)).toEqual({ third: ["X", "X", "X"] });
    });

    it("should handle 2 winning lines", () => {
      const lines = {
        first: ["X", "X", "O"],
        second: ["O", "O", "O"],
        third: ["X", "X", "X"]
      };

      expect(findWinPattern(lines)).toEqual({
        second: ["O", "O", "O"],
        third: ["X", "X", "X"]
      });
    });

    it("should handle incomplete line ", () => {
      const lines = {
        first: ["X", undefined, "X"]
      };

      expect(findWinPattern(lines)).toBeUndefined();
    });
  });
});
