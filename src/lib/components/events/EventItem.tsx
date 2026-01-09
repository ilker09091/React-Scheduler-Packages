import { Fragment, MouseEvent, useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { ProcessedEvent } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { differenceInDaysOmitTime, getHourFormat } from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useDragAttributes from "../../hooks/useDragAttributes";
import EventItemPopover from "./EventItemPopover";
import useEventPermissions from "../../hooks/useEventPermissions";

interface EventItemProps {
  event: ProcessedEvent;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({ event, multiday, hasPrev, hasNext, showdate = true }: EventItemProps) => {
  const { direction, locale, hourFormat, eventRenderer, onEventClick, view, disableViewer } =
    useStore();
  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const hFormat = getHourFormat(hourFormat);

  const NextArrow = direction === "rtl" ? ChevronLeftIcon : ChevronRightIcon;
  const PrevArrow = direction === "rtl" ? ChevronRightIcon : ChevronLeftIcon;
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;

  const { canDrag } = useEventPermissions(event);

  const triggerViewer = useCallback(
    (el?: MouseEvent<Element>) => {
      if (!el?.currentTarget && deleteConfirm) {
        setDeleteConfirm(false);
      }
      setAnchorEl(el?.currentTarget || null);
    },
    [deleteConfirm]
  );

  const getEventStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: event.disabled ? "#e5e7eb" : event.color || "#4f46e5",
      color: event.disabled ? "#6b7280" : event.textColor || "#ffffff",
      ...(event.sx || {}),
    };

    // Gradient efekt için
    if (!event.disabled && !event.textColor) {
      baseStyles.background = event.color 
        ? `linear-gradient(135deg, ${event.color} 0%, ${adjustColor(event.color, -20)} 100%)`
        : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)";
    }

    return baseStyles;
  };

  const adjustColor = (color: string, amount: number) => {
    let usePound = false;
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00ff) + amount;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000ff) + amount;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };

  const renderEvent = useMemo(() => {
    if (typeof eventRenderer === "function" && !multiday && view !== "month") {
      const custom = eventRenderer({ event, onClick: triggerViewer, ...dragProps });
      if (custom) {
        return (
          <div
            key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
            className="event-item-custom"
          >
            {custom}
          </div>
        );
      }
    }

    const eventStyles = getEventStyles();

    // Normal event (non-multiday)
    if (!multiday) {
      return (
        <div
          key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
          className={`
            group relative overflow-hidden rounded-lg transition-all duration-200
            ${event.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'}
            ${!event.disabled ? 'shadow-sm' : ''}
          `}
          style={eventStyles}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disableViewer) {
              triggerViewer(e);
            }
            if (typeof onEventClick === "function") {
              onEventClick(event);
            }
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div 
            className="relative p-2"
            {...dragProps} 
            draggable={canDrag}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-tight">
                  {event.title}
                </p>
                {event.subtitle && (
                  <p className="text-[11px] opacity-90 truncate mt-0.5">
                    {event.subtitle}
                  </p>
                )}
                {showdate && (
                  <p className="text-[10px] opacity-80 mt-1">
                    {`${format(event.start, hFormat, { locale })} - ${format(event.end, hFormat, { locale })}`}
                  </p>
                )}
              </div>
              
              {/* Drag handle indicator */}
              {canDrag && !event.disabled && (
                <div className="flex-shrink-0 w-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-4 w-1 bg-white/30 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Multiday event
    return (
      <div
        key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
        className={`
          group relative overflow-hidden rounded-lg transition-all duration-200
          ${event.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'}
          ${!event.disabled ? 'shadow-sm' : ''}
        `}
        style={eventStyles}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disableViewer) {
            triggerViewer(e);
          }
          if (typeof onEventClick === "function") {
            onEventClick(event);
          }
        }}
      >
        <div 
          className="relative p-1.5"
          {...dragProps}
          draggable={canDrag}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              {hasPrev ? (
                <PrevArrow className="w-3 h-3 flex-shrink-0 opacity-80" />
              ) : showdate && !hideDates ? (
                <span className="text-[10px] opacity-90 truncate">
                  {format(event.start, hFormat, { locale })}
                </span>
              ) : (
                <span className="w-3" /> // Spacer for alignment
              )}
            </div>
            
            <div className="flex-1 min-w-0 mx-1">
              <p className="text-xs font-semibold text-center truncate px-1">
                {event.title}
              </p>
            </div>
            
            <div className="flex items-center gap-1 min-w-0">
              {hasNext ? (
                <NextArrow className="w-3 h-3 flex-shrink-0 opacity-80" />
              ) : showdate && !hideDates ? (
                <span className="text-[10px] opacity-90 truncate">
                  {format(event.end, hFormat, { locale })}
                </span>
              ) : (
                <span className="w-3" /> // Spacer for alignment
              )}
            </div>
          </div>
          
          {/* Subtle gradient overlay on hover */}
          {!event.disabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>
      </div>
    );
  }, [
    eventRenderer,
    multiday,
    view,
    event,
    showdate,
    hFormat,
    locale,
    disableViewer,
    dragProps,
    canDrag,
    triggerViewer,
    hasPrev,
    PrevArrow,
    hideDates,
    hasNext,
    NextArrow,
    onEventClick,
  ]);

  return (
    <Fragment>
      {renderEvent}

      {/* Viewer */}
      <EventItemPopover anchorEl={anchorEl} event={event} onTriggerViewer={triggerViewer} />
    </Fragment>
  );
};

export default EventItem;