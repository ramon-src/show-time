import { test, chromium, Locator, expect } from "@playwright/test";
import { EventType } from "./types";
import { concatEventData, urlify } from "./utils/url";

const arr: EventType[] = [
  {
    type: "show",
    artist: "post malone",
    location: "estados unidos",
    moments: ["março 2024"],
  },
  {
    type: "show",
    artist: "tailor swift",
    location: "estados unidos",
    moments: ["março 2024"],
  },
];
// generate a function to transform a string into a url notation string

arr.forEach(async (event: EventType) => {
  const { artist, location, type, moments } = event;
  moments.forEach(async (moment) => {
    test(`crawler ${concatEventData(event, moment)}`, async () => {
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage({
        viewport: { width: 1928, height: 1080 },
      });
      await page.goto(
        `https://www.google.com/search?q=${concatEventData(
          event,
          moment
        )}&oq=+${urlify(
          location
        )}&sourceid=chrome&ie=UTF-8&ibp=htl;events&rciv=evn&sa=X&fpstate=tldetail`
      );

      //?q=festa+porto+alegre+hoje&oq=+porto+alegre&sourceid=chrome&ie=UTF-8&ibp=htl;events&rciv=evn&sa=X&fpstate=tldetail

      const events_container = await page.locator("ul.voohof").first();
      let list = events_container.locator("li.PaEvOc");
      if ((await list.count()) == 0) {
        expect(list.count()).toBe(0);
      } else {
        await scrollToTheEnd(list);
        let updatedEventList: Locator[] = await groupAllEvents(page);
        await logItems(updatedEventList);
      }
    });
  });
});

async function scrollToTheEnd(list: Locator) {
  let hasMoreEvents = true;

  await list.first().click();
  while (hasMoreEvents) {
    setTimeout(() => {
      hasMoreEvents = false;
    }, 6000);

    await list.last().press("PageDown", { delay: 300 });
  }
}

async function groupAllEvents(page) {
  const lists = await page.locator("ul.PkcPZe").all();
  let updatedEventList: Locator[] = [];
  for (let i = 0; i < lists.length; i++) {
    const events = await lists[i].locator("li.PaEvOc").all();
    updatedEventList = [...updatedEventList, ...events];
  }
  return updatedEventList;
}

async function logItems(updatedEventList) {
  for (let i = 0; i < updatedEventList.length; i++) {
    const event: Locator = updatedEventList[i];

    const title = await event.locator(".YOGjf").innerText();
    const location = await event.locator(".SHrHx").allInnerTexts();
    const [time, address, region] = location[0].split("\n");
    const day = await event.locator(".UIaQzd").innerText();
    const month = await event.locator(".wsnHcb").innerText();
    const img = await event.locator(".H3ReNc.CT1Nuf img").getAttribute("src");
    console.log(title, img);
  }
}
