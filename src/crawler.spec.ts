import { test, chromium, Locator, expect } from "@playwright/test";
import { ArtistSearch, EventType } from "./types";
import { concatEventData, urlify } from "./utils/url";
import { eventsList } from "./crawlerEventsReader";
import { insertEvents } from "./db/events";

const arr: ArtistSearch[] = eventsList();
// generate a function to transform a string into a url notation string
// https://www.google.com/search?q=shows+sepultura+porto+alegre&oq=+porto+alegre&sourceid=chrome&ie=UTF-8&ibp=htl;events&rciv=evn&sa=X&fpstate=tldetail#fpstate=tldetail&htivrt=events&htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDI0LTA0LTIxfDEzMzY2OTE4NjMzMTc5MTk1MDg%3D

// https://www.google.com/search?q=shows+sepultura+porto+alegre&oq=+porto+alegre&sourceid=chrome&ie=UTF-8&ibp=htl;events&rciv=evn&sa=X&fpstate=tldetail#fpstate=tldetail

// https://www.google.com/search?q=shows+porto+alegre+mar%C3%A7o&oq=+porto+alegre&sourceid=chrome&ie=UTF-8&ibp=htl;events&rciv=evn&sa=X&fpstate=tldetail#fpstate=tldetail&htivrt=events
arr.forEach(async (event: ArtistSearch) => {
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
      const eventsFound = await list.count();
      if (eventsFound == 0) {
        expect(eventsFound).toBe(0);
      } else {
        await scrollToTheEnd(list);
        let initiaEventlList: Locator[] = await groupAllEvents(
          page.locator("ul.voohof")
        );
        let updatedEventList: Locator[] = await groupAllEvents(
          page.locator("ul.PkcPZe")
        );
        const mergedEventList = initiaEventlList.concat(updatedEventList);
        const eventsList = await makeEventsList(event.artist, mergedEventList);

        await insertEvents(eventsList).catch(console.dir);
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

async function groupAllEvents(locator) {
  const lists = await locator.all();
  let updatedEventList: Locator[] = [];
  for (let i = 0; i < lists.length; i++) {
    const events = await lists[i].locator("li.PaEvOc").all();
    updatedEventList = [...updatedEventList, ...events];
  }
  return updatedEventList;
}

async function makeEventsList(artist, updatedEventList): Promise<EventType[]> {
  const eventsList: EventType[] = [];
  for (let i = 0; i < updatedEventList.length; i++) {
    const event: Locator = updatedEventList[i];

    const title = await event.locator(".YOGjf").innerText();
    const location = await event.locator(".SHrHx").allInnerTexts();
    const [time, address, region] = location[0].split("\n");
    const day = await event.locator(".UIaQzd").innerText();
    const month = await event.locator(".wsnHcb").innerText();
    const img =
      (await event.locator(".H3ReNc.CT1Nuf img").getAttribute("src")) ?? "";
    eventsList.push({
      artist,
      title,
      location: address,
      time: time,
      day: day,
      month: month,
      region: region,
      img_url: img,
    });
  }
  return eventsList;
}
