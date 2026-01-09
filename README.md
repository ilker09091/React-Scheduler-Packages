# React Scheduler Component

[![npm package](https://img.shields.io/npm/v/@ilkerdeveloper/react-scheduler-packages.svg?label=npm+package&style=flat-square)](https://www.npmjs.com/package/@ilkerdeveloper/react-scheduler-packages)

> ⚠️ **Notice**: This component uses `@mui/material`, `@emotion/react`, and `date-fns`.  
> If your project is not already using these libs, this component may not be suitable.

---

## Installation

```bash
npm i @ilkerdeveloper/react-scheduler-packages
````

If you plan to use recurring events in your scheduler, install `rrule` as well:
[https://www.npmjs.com/package/rrule](https://www.npmjs.com/package/rrule)

---

## Usage

```tsx
import { Scheduler } from "@ilkerdeveloper/react-scheduler-packages";
```

### Example

```tsx
<Scheduler
  view="month"
  events={[
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2021/5/2 09:30"),
      end: new Date("2021/5/2 10:30"),
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2021/5/4 10:00"),
      end: new Date("2021/5/4 11:00"),
    },
  ]}
/>
```

---

## Scheduler Props

All props are *optional*

| Prop                    | Value / Description                                                                       |                       |                     |
| ----------------------- | ----------------------------------------------------------------------------------------- | --------------------- | ------------------- |
| height                  | number. Min height of table. Default: `600`                                               |                       |                     |
| view                    | string. Initial view to load. Options: `"week"`, `"month"`, `"day"`. Default: `"week"`    |                       |                     |
| agenda                  | boolean. Activate agenda view                                                             |                       |                     |
| alwaysShowAgendaDays    | boolean. If true, day rows without events will be shown                                   |                       |                     |
| month                   | Object. Month view props. Default: see `src/defaults.ts`                                  |                       |                     |
| week                    | Object. Week view props. Default: see `src/defaults.ts`                                   |                       |                     |
| day                     | Object. Day view props. Default: see `src/defaults.ts`                                    |                       |                     |
| selectedDate            | Date. Initial selected date. Default: `new Date()`                                        |                       |                     |
| navigation              | boolean. Show/Hide top bar date navigation. Default: `true`                               |                       |                     |
| events                  | Array of ProcessedEvent. Default: `[]`                                                    |                       |                     |
| eventRenderer           | Function(event: ProcessedEvent): React.ReactNode                                          |                       |                     |
| editable                | boolean. Enable/disable editing of events                                                 |                       |                     |
| deletable               | boolean. Enable/disable deleting events                                                   |                       |                     |
| draggable               | boolean. Enable/disable drag & drop                                                       |                       |                     |
| getRemoteEvents         | Function(RemoteQuery). Return promise of array of events                                  |                       |                     |
| fields                  | Array of extra fields with configurations                                                 |                       |                     |
| loading                 | boolean. Loading state of the calendar table                                              |                       |                     |
| onConfirm               | Function(event, action). Returns promise with new/edited event                            |                       |                     |
| onDelete                | Function(id). Returns promise with deleted event id                                       |                       |                     |
| customEditor            | Function(scheduler). Override editor modal                                                |                       |                     |
| customViewer            | Function(event: ProcessedEvent, close: () => void). Override event viewer content         |                       |                     |
| viewerExtraComponent    | Additional component in event viewer popper                                               |                       |                     |
| viewerTitleComponent    | Custom title in event popper                                                              |                       |                     |
| viewerSubtitleComponent | Custom subtitle in event popper                                                           |                       |                     |
| disableViewer           | boolean. Disable the viewer popover globally                                              |                       |                     |
| resources               | Array. Resources array to split event views                                               |                       |                     |
| resourceFields          | Object. Map resource fields correctly                                                     |                       |                     |
| resourceHeaderComponent | Function(resource). Override header component of resource                                 |                       |                     |
| resourceViewMode        | Display resources mode: `"default"`                                                       | `"vertical"`          | `"tabs"`            |
| onResourceChange        | Function(resource). Triggered when resource tab changes                                   |                       |                     |
| direction               | string. `"rtl"`                                                                           | `"ltr"`               |                     |
| dialogMaxWidth          | Editor dialog max width. Ex: `lg`                                                         | `md`                  | `sm`. Default: `md` |
| locale                  | Locale of date-fns. Default: `enUS`                                                       |                       |                     |
| hourFormat              | `"12"`                                                                                    | `"24"`. Default: `12` |                     |
| timeZone                | String. Time zone [IANA ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |                       |                     |
| translations            | Object. Translations for UI texts. Default in `src/defaults.ts`                           |                       |                     |
| onEventDrop             | Function(event, droppedOn, updatedEvent, originalEvent). Returns promise                  |                       |                     |
| onEventClick            | Function(event). Triggered on event click                                                 |                       |                     |
| onEventEdit             | Function(event). Triggered when editing an event                                          |                       |                     |
| onCellClick             | Function(start, end, resourceKey?, resourceVal?). Triggered on cell click                 |                       |                     |
| onSelectedDateChange    | Function(date). Triggered when selectedDate changes                                       |                       |                     |
| onViewChange            | Function(view, agenda?). Triggered when navigation view changes                           |                       |                     |
| stickyNavigation        | boolean. Sticky top navigation bar                                                        |                       |                     |
| onClickMore             | Function(date, goToDay). Triggered when “More…” button is clicked                         |                       |                     |

---

## SchedulerRef

Used to manage internal state from outside:

```tsx
import { Scheduler } from "@ilker09091/react-scheduler-packages";
import type { SchedulerRef } from "@ilker09091/react-scheduler-packages/types";
import { useRef, Fragment } from "react";
import { Button } from "@mui/material";

const SomeComponent = () => {
  const calendarRef = useRef<SchedulerRef>(null);

  return (
    <Fragment>
      <div>
        <Button
          onClick={() => {
            calendarRef.current.scheduler.handleState("day", "view");
          }}
        >
          Change View
        </Button>
        <Button
          onClick={() => {
            calendarRef.current.scheduler.triggerDialog(true, {
              start: new Date(),
              end: new Date(),
            });
          }}
        >
          Add Event Tomorrow
        </Button>
      </div>

      <Scheduler ref={calendarRef} events={EVENTS} />
    </Fragment>
  );
};
```

`calendarRef.current.scheduler.handleState(value, key)` ile tüm iç state’e erişebilirsin.

---

## Demo

* [Remote Data Demo](https://codesandbox.io/s/remote-data-j13ei)

---

## Todos

* [ ] Tests
* [x] Drag & Drop - partially
* [ ] Resizable
* [x] Recurring events - partially
* [x] Localization
* [x] Hour format 12 | 24

---