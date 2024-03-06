import { test, expect } from "@playwright/test";
import { concatEventData, urlify } from "./url";
test("urlify", () => {
  expect(urlify("festa porto alegre março 2024")).toBe(
    "festa+porto+alegre+mar%c3%a7o+2024"
  );
});

test("concatEventDate", () => {
  expect(
    concatEventData(
      {
        type: "show",
        artist: "Armandinho",
        location: "Porto Alegre",
        moments: ["março 2024"],
      },
      "março 2024"
    )
  ).toBe("show+armandinho+mar%c3%a7o+2024+porto+alegre");
});
